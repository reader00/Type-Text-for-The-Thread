module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        'jest/globals': true,
    },
    extends: ['airbnb-base'],
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        'no-console': 0,
        'no-underscore-dangle': 0,
        indent: ['error', 4],
    },
};
