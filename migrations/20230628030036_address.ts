import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("address", (table) => {
        table.increments("id").primary();
        table.string("street").notNullable();
        table.integer("number").notNullable();
        table.text("city").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("address");
}
