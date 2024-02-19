/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", t => {
    t.increments("id").primary();
    t.string("name").notNullable();
    t.string("email").notNullable().unique();
    t.dateTime("last_logged_in");
    t.boolean("is_deleted").notNullable().defaultTo(false);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
