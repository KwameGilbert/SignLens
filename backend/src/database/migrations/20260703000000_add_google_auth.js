export const up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('googleId', 255).unique().nullable();
    table.string('passwordHash', 255).nullable().alter();
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('googleId');
    table.string('passwordHash', 255).notNullable().alter();
  });
};
