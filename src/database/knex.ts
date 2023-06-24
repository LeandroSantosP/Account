import knex from "knex";
const config = require("../../knexfile")["development"];

const knex_connection = knex(config);

export { knex_connection };
