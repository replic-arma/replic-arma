module.exports = {
    root: true,
    env: {
        es2021: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    rules: {
        indent: ['error', 4],
        semi: 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'import/extensions': 'off',
        'import/no-cycle': 'off'
    }
};
