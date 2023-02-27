/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'standard',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier'
    ],
    env: {
        'vue/setup-compiler-macros': true,
        es2021: true
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['error', 4],
        semi: ['error', 'always'],
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
    }
};
