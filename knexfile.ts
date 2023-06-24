/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "0.0.0.0",
      port: 5432,
      user: "account_admin",
      password: "account_pass",
      database: "postgres",
    },
  },
};