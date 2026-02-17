// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
      },
    },
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'netz',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'netz',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
);
