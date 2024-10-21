module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 1,
    'no-extra-boolean-cast': 'off',
    'no-lonely-if': 1,
    'no-unexpected-multiline': 'warn',
    'prettier/prettier': 'error',
  },
}
