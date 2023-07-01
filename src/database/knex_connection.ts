const development = {
    client: "pg",
    connection: {
        host: "0.0.0.0",
        port: 5432,
        user: "account_admin",
        password: "account_pass",
        database: "postgres",
    },
};

const test = {
    client: "pg",
    connection: {
        host: "0.0.0.0",
        port: 5432,
        user: "account_admin_test",
        password: "account_pass_test",
        database: "postgres_test",
    },
};

export { development, test };
