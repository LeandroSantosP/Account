import { knex_connection } from "../src/database/knex";

async function cleanDatabase() {
    await knex_connection.raw("TRUNCATE TABLE account");
    await knex_connection.raw("TRUNCATE TABLE account_profile, address CASCADE");
}

export { cleanDatabase };
