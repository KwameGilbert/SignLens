import db from '../../config/db.js';

export const runMigrations = async () => {
  console.log('Running database migrations with Knex...');

  // 1. Create users table if not exists
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('firstName', 255);
      table.string('lastName', 255);
      table.string('email', 255).unique().notNullable();
      table.string('passwordHash', 255).notNullable();
      table.string('status', 50).defaultTo('active');
      table.text('profile');
      table.string('role', 50).defaultTo('user'); // super_admin, content_editor, moderator, user
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "users" created successfully.');
  } else {
    console.log('Table "users" already exists.');
  }

  // 2. Create lessonCategories table if not exists
  const hasCategories = await db.schema.hasTable('lessonCategories');
  if (!hasCategories) {
    await db.schema.createTable('lessonCategories', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('slug', 255).unique().notNullable();
      table.string('icon', 255);
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "lessonCategories" created successfully.');
  } else {
    console.log('Table "lessonCategories" already exists.');
  }

  // 3. Create lessons table if not exists
  const hasLessons = await db.schema.hasTable('lessons');
  if (!hasLessons) {
    await db.schema.createTable('lessons', (table) => {
      table.increments('id').primary();
      table.string('title', 255).notNullable();
      table.integer('categoryId').unsigned().notNullable()
        .references('id').inTable('lessonCategories').onDelete('CASCADE');
      table.string('type', 50).notNullable(); // e.g. video, text
      table.string('slug', 255).unique().notNullable();
      table.string('lessonUrl', 500);
      table.text('description');
      table.json('instructions'); // array of steps
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "lessons" created successfully.');
  } else {
    console.log('Table "lessons" already exists.');
  }

  // 4. Create quizzes table if not exists
  const hasQuizzes = await db.schema.hasTable('quizzes');
  if (!hasQuizzes) {
    await db.schema.createTable('quizzes', (table) => {
      table.increments('id').primary();
      table.integer('categoryId').unsigned()
        .references('id').inTable('lessonCategories').onDelete('SET NULL');
      table.integer('lessonId').unsigned().notNullable()
        .references('id').inTable('lessons').onDelete('CASCADE');
      table.text('question').notNullable();
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "quizzes" created successfully.');
  } else {
    console.log('Table "quizzes" already exists.');
  }

  // 5. Create quizOptions table if not exists
  const hasQuizOptions = await db.schema.hasTable('quizOptions');
  if (!hasQuizOptions) {
    await db.schema.createTable('quizOptions', (table) => {
      table.increments('id').primary();
      table.integer('quizId').unsigned().notNullable()
        .references('id').inTable('quizzes').onDelete('CASCADE');
      table.string('name', 555).notNullable();
      table.boolean('isCorrect').defaultTo(false);
      table.integer('orderIndex').defaultTo(0);
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "quizOptions" created successfully.');
  } else {
    console.log('Table "quizOptions" already exists.');
  }

  // 6. Create badges table if not exists
  const hasBadges = await db.schema.hasTable('badges');
  if (!hasBadges) {
    await db.schema.createTable('badges', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('icon', 255); // icon reference
      table.text('description');
      table.integer('xpReward').defaultTo(0);
      table.string('triggerRequirement', 255).notNullable();
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "badges" created successfully.');
  } else {
    console.log('Table "badges" already exists.');
  }

  // 7. Create translationLogs table if not exists
  const hasTranslationLogs = await db.schema.hasTable('translationLogs');
  if (!hasTranslationLogs) {
    await db.schema.createTable('translationLogs', (table) => {
      table.increments('id').primary();
      table.integer('userId').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.string('mode', 50).notNullable(); // voice, camera, text
      table.string('prediction', 255).notNullable();
      table.double('confidenceRating').notNullable();
      table.string('resolutionStatus', 50).notNullable(); // failed, success, low_confidence
      table.timestamp('createdAt').defaultTo(db.fn.now());
    });
    console.log('Table "translationLogs" created successfully.');
  } else {
    console.log('Table "translationLogs" already exists.');
  }

  // 8. Create activityLogs table if not exists
  const hasActivityLogs = await db.schema.hasTable('activityLogs');
  if (!hasActivityLogs) {
    await db.schema.createTable('activityLogs', (table) => {
      table.increments('id').primary();
      table.integer('userId').unsigned()
        .references('id').inTable('users').onDelete('SET NULL');
      table.text('eventDescription').notNullable();
      table.string('category', 100).notNullable();
      table.json('before');
      table.json('after');
      table.timestamp('createdAt').defaultTo(db.fn.now());
    });
    console.log('Table "activityLogs" created successfully.');
  } else {
    console.log('Table "activityLogs" already exists.');
  }

  // 9. Create settings table if not exists
  const hasSettings = await db.schema.hasTable('settings');
  if (!hasSettings) {
    await db.schema.createTable('settings', (table) => {
      table.increments('id').primary();
      table.string('key', 255).unique().notNullable();
      table.text('value');
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.timestamp('updatedAt').defaultTo(db.fn.now());
    });
    console.log('Table "settings" created successfully.');
  } else {
    console.log('Table "settings" already exists.');
  }

  console.log('Migrations completed successfully.');
};

// Check if run directly from command line
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
  runMigrations()
    .then(() => {
      console.log('Migration process exited.');
      db.destroy();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      db.destroy();
      process.exit(1);
    });
}
export default runMigrations;
