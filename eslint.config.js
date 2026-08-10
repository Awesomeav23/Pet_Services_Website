import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Flat ESLint config.
 *
 * jsx-a11y is included deliberately: the accessibility work in this project
 * should be enforced by the linter rather than depending on review, so a
 * missing label or a click handler on a non-interactive element fails `npm run
 * lint` instead of shipping.
 */
export default [
  // dist and coverage are generated output, not source.
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Props are documented by the JSDoc on each component; PropTypes would
      // duplicate that without adding checking at build time.
      'react/prop-types': 'off',

      // Discarding a value while destructuring is intentional in the error
      // handlers, e.g. `const { [name]: _removed, ...rest } = prev`.
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Playwright specs and config run in Node, not the browser.
  {
    files: ['e2e/**/*.js', 'playwright.config.js', 'vitest.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
