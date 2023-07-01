import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("account", (table) => {
        table.increments("id").primary();
        table.text("name").notNullable();
        table.uuid("client_id").notNullable();
        table.foreign("client_id").references("account_profile.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.text("code").unique().notNullable();
        table.decimal("balance").defaultTo(0);
        table.integer("sequence").unique();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("account");
}
