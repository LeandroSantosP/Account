import knex from "knex";

const config = require("../../knexfile")[process.env.CURRENT_DB || "development"];

const knex_connection = knex(config);

export { knex_connection };
