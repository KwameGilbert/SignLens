import db from '../../config/db.js';

export const runMigrations = async () => {
  console.log('Running database migrations with Knex...');

  // 1. Create users table if not exists
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name', 255);
      table.string('last_name', 255);
      table.string('email', 255).unique().notNullable();
      table.string('password_hash', 255).notNullable();
      table.string('status', 50).defaultTo('active');
      table.text('profile');
      table.string('role', 50).defaultTo('user'); // super_admin, content_editor, moderator, user
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('Table "users" created successfully.');
  } else {
    console.log('Table "users" already exists.');
  }

  // 2. Create lesson_categories table if not exists
  const hasCategories = await db.schema.hasTable('lesson_categories');
  if (!hasCategories) {
    await db.schema.createTable('lesson_categories', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('slug', 255).unique().notNullable();
      table.string('icon', 255);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('Table "lesson_categories" created successfully.');
  } else {
    console.log('Table "lesson_categories" already exists.');
  }

  // 3. Create lessons table if not exists
  const hasLessons = await db.schema.hasTable('lessons');
  if (!hasLessons) {
    await db.schema.createTable('lessons', (table) => {
      table.increments('id').primary();
      table.string('title', 255).notNullable();
      table.integer('category_id').unsigned().notNullable()
        .references('id').inTable('lesson_categories').onDelete('CASCADE');
      table.string('type', 50).notNullable(); // e.g. video, text
      table.string('slug', 255).unique().notNullable();
      table.string('lesson_url', 500);
      table.text('description');
      table.json('instructions'); // array of steps
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
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
      table.integer('category_id').unsigned()
        .references('id').inTable('lesson_categories').onDelete('SET NULL');
      table.integer('lesson_id').unsigned().notNullable()
        .references('id').inTable('lessons').onDelete('CASCADE');
      table.text('question').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('Table "quizzes" created successfully.');
  } else {
    console.log('Table "quizzes" already exists.');
  }

  // 5. Create quiz_options table if not exists
  const hasQuizOptions = await db.schema.hasTable('quiz_options');
  if (!hasQuizOptions) {
    await db.schema.createTable('quiz_options', (table) => {
      table.increments('id').primary();
      table.integer('quiz_id').unsigned().notNullable()
        .references('id').inTable('quizzes').onDelete('CASCADE');
      table.string('name', 555).notNullable();
      table.boolean('is_correct').defaultTo(false);
      table.integer('order_index').defaultTo(0);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('Table "quiz_options" created successfully.');
  } else {
    console.log('Table "quiz_options" already exists.');
  }

  // 6. Create badges table if not exists
  const hasBadges = await db.schema.hasTable('badges');
  if (!hasBadges) {
    await db.schema.createTable('badges', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('icon', 255); // icon reference
      table.text('description');
      table.integer('xp_reward').defaultTo(0);
      table.string('trigger_requirement', 255).notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('Table "badges" created successfully.');
  } else {
    console.log('Table "badges" already exists.');
  }

  // 7. Create translation_logs table if not exists
  const hasTranslationLogs = await db.schema.hasTable('translation_logs');
  if (!hasTranslationLogs) {
    await db.schema.createTable('translation_logs', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.string('mode', 50).notNullable(); // voice, camera, text
      table.string('prediction', 255).notNullable();
      table.double('confidence_rating').notNullable();
      table.string('resolution_status', 50).notNullable(); // failed, success, low_confidence
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('Table "translation_logs" created successfully.');
  } else {
    console.log('Table "translation_logs" already exists.');
  }

  // 8. Create activity_logs table if not exists
  const hasActivityLogs = await db.schema.hasTable('activity_logs');
  if (!hasActivityLogs) {
    await db.schema.createTable('activity_logs', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned()
        .references('id').inTable('users').onDelete('SET NULL');
      table.text('event_description').notNullable();
      table.string('category', 100).notNullable();
      table.json('before');
      table.json('after');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('Table "activity_logs" created successfully.');
  } else {
    console.log('Table "activity_logs" already exists.');
  }

  // 9. Create settings table if not exists
  const hasSettings = await db.schema.hasTable('settings');
  if (!hasSettings) {
    await db.schema.createTable('settings', (table) => {
      table.increments('id').primary();
      table.string('key', 255).unique().notNullable();
      table.text('value');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
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
