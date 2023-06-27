module.exports = {
  env: {
        browser: true,
        es2021: true,
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "@typescript-eslint/indent": ["error", 4],
    },
};
