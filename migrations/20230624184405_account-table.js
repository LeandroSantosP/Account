/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("account", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.uuid("client_id").notNullable();
    table.text("code").unique().notNullable();
    table.decimal("balance").defaultTo(0);
    table.integer("sequence").unique();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("account");
};
