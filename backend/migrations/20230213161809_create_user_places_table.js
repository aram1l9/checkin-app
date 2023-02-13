/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_places", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .index()
      .references("id")
      .inTable("users");
    table
      .integer("place_id")
      .unsigned()
      .index()
      .references("id")
      .inTable("places");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
