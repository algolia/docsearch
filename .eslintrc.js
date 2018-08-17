/* eslint-disable import/no-commonjs */
module.exports = {
  extends: ['algolia', 'algolia/jest'],
  globals: {
    instantsearch: true,
    search: true,
    talksearch: true,
    indexName: true,
    apiKey: true,
    placeholder: true,
  },
  rules: {
    'no-console': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
