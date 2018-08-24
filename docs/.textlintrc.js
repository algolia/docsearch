/* eslint-disable import/no-commonjs */
module.exports = {
  rules: {
    'common-misspellings': true,
    'en-capitalization': true,
    'stop-words': {
      exclude: [
        'relative to', // We need to talk about links "relative to the root"
      ],
    },
    terminology: {
      defaultTerms: false,
      terms: `${__dirname}/.textlint.terms.json`,
    },
    'write-good': {
      passive: false,
    },
  },
};
