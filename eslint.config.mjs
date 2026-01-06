import algolia from 'eslint-config-algolia/flat/base.js';
import algoliaReact from 'eslint-config-algolia/flat/react.js';
import algoliaTypescript from 'eslint-config-algolia/flat/typescript.js';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint'; // eslint-disable-line import/no-unresolved

export default [
  ...algolia,
  ...algoliaReact,
  ...algoliaTypescript,
  {
    ignores: ['**/node_modules/', '**/dist/', '**/build/', '.yarn/', '**/.docusaurus'],
  },
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'no-param-reassign': 0,
      'valid-jsdoc': 0,
      'no-shadow': 0,
      'prefer-template': 0,
      'react/prop-types': 0,
      'react/no-unescaped-entities': 0,
      'import/extensions': 0,
      'no-unused-expressions': 0,
      complexity: 0,
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@/**/*',
              group: 'parent',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],

      // TMP
      'react/function-component-definition': ['off'],
      'react/jsx-filename-extension': ['off'],
      'jsdoc/check-examples': ['off'],
    },
  },
  {
    files: ['**/*.js'],
  },
  tseslint.configs.disableTypeChecked,
  {
    files: ['e2e/**/*'],
    rules: {
      '@typescript-eslint/no-floating-promises': 0,
    },
  },
  {
    files: ['packages/website/**/*'],
    rules: {
      'import/no-unresolved': 0,
      'import/no-extraneous-dependencies': 0,
    },
  },
  {
    files: ['examples/demo/**/*'],
    rules: {
      'react/react-in-jsx-scope': 0,
    },
  },
];
