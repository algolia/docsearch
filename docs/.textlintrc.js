/* eslint-disable import/no-commonjs */
module.exports = {
  rules: {
    'common-misspellings': true,
    'en-capitalization': true,
    terminology: {
      defaultTerms: false,
      terms: `${__dirname}/.textlint.terms.json`,
    },
    'stop-words': {
      exclude: [
        'relative to', // We need to talk about links "relative to the root"
      ],
    },
  },
};
