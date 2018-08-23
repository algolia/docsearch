/* eslint-disable import/no-commonjs */
module.exports = {
  rules: {
    'common-misspellings': true,
    'stop-words': {
      exclude: [
        'relative to', // We need to talk about links "relative to the root"
      ],
    },
  },
};
