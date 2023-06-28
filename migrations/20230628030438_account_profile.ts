import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("account_profile", (table) => {
        table.uuid("id").primary();
        table.text("name").notNullable();
        table.text("email").unique().notNullable();
        table.text("password").notNullable();
        table.increments("address_id").unique().unsigned();
        table.foreign("address_id").references("address.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("account_profile");
}
