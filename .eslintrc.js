module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        // 'jest/globals': true,
    },
    extends: ['airbnb-base', 'plugin:jest/recommended'],
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        'no-console': 0,
        'no-underscore-dangle': 0,
        indent: ['error', 4],
        'linebreak-style': 0,
        'class-methods-use-this': 0,
        'operator-linebreak': 0,
        'object-curly-newline': 0,
    },
};
