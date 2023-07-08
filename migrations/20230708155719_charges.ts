import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("charges", (table) => {
        table.uuid("id").primary();
        table.text("description").notNullable();
        table.text("status").notNullable();
        table.decimal("amount").notNullable();
        table.decimal("current_amount").notNullable();
        table.text("client_code").notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("charges");
}
