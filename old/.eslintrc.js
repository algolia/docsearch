/* eslint-disable import/no-commonjs */
module.exports = {
  extends: ['algolia', 'algolia/jest'],
  globals: {
    docsearch: true,
    Glide: true,
    Popper: true
  },
  rules: {
    'no-console': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
