export const up = async (knex) => {
  // 1. Create users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('firstName', 255);
    table.string('lastName', 255);
    table.string('email', 255).unique().notNullable();
    table.string('passwordHash', 255).notNullable();
    table.string('status', 50).defaultTo('active');
    table.text('profile');
    table.string('role', 50).defaultTo('user');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 2. Create lessonCategories table
  await knex.schema.createTable('lessonCategories', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('slug', 255).unique().notNullable();
    table.string('icon', 255);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 3. Create lessons table
  await knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.integer('categoryId').unsigned().notNullable()
      .references('id').inTable('lessonCategories').onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.string('slug', 255).unique().notNullable();
    table.string('lessonUrl', 500);
    table.text('description');
    table.json('instructions');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 4. Create quizzes table
  await knex.schema.createTable('quizzes', (table) => {
    table.increments('id').primary();
    table.integer('categoryId').unsigned()
      .references('id').inTable('lessonCategories').onDelete('SET NULL');
    table.integer('lessonId').unsigned().notNullable()
      .references('id').inTable('lessons').onDelete('CASCADE');
    table.text('question').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 5. Create quizOptions table
  await knex.schema.createTable('quizOptions', (table) => {
    table.increments('id').primary();
    table.integer('quizId').unsigned().notNullable()
      .references('id').inTable('quizzes').onDelete('CASCADE');
    table.string('name', 555).notNullable();
    table.boolean('isCorrect').defaultTo(false);
    table.integer('orderIndex').defaultTo(0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 6. Create badges table
  await knex.schema.createTable('badges', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('icon', 255);
    table.text('description');
    table.integer('xpReward').defaultTo(0);
    table.string('triggerRequirement', 255).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 7. Create translationLogs table
  await knex.schema.createTable('translationLogs', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('mode', 50).notNullable();
    table.string('prediction', 255).notNullable();
    table.double('confidenceRating').notNullable();
    table.string('resolutionStatus', 50).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  // 8. Create activityLogs table
  await knex.schema.createTable('activityLogs', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned()
      .references('id').inTable('users').onDelete('SET NULL');
    table.text('eventDescription').notNullable();
    table.string('category', 100).notNullable();
    table.json('before');
    table.json('after');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  // 9. Create settings table
  await knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.string('key', 255).unique().notNullable();
    table.text('value');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('activityLogs');
  await knex.schema.dropTableIfExists('translationLogs');
  await knex.schema.dropTableIfExists('badges');
  await knex.schema.dropTableIfExists('quizOptions');
  await knex.schema.dropTableIfExists('quizzes');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('lessonCategories');
  await knex.schema.dropTableIfExists('users');
};
