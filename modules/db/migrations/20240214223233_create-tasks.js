/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("tasks", t => {
    t.increments("id").primary();
    t.integer("user_id").references("id").inTable("users").notNullable();
    t.string("title").notNullable();
    t.boolean("is_completed").notNullable().defaultTo(false);
    t.boolean("is_deleted").notNullable().defaultTo(false);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("tasks");
};
