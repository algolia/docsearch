/* eslint-disable import/no-commonjs */
module.exports = {
  rules: {
    alex: {
      allow: ['color', 'hook', 'host-hostess', 'itch'],
    },
    'common-misspellings': true,
    'en-capitalization': true,
    'stop-words': {
      exclude: [
        'relative to', // We need to talk about links "relative to the root",
        'pick out', // Needed word, not to clumsy
        'encounter', // Needed word, not to clumsy
      ],
    },
    terminology: {
      defaultTerms: false,
      terms: `${__dirname}/.textlint.terms.json`,
    },
    'write-good': {
      passive: true,
      severity: 'warning',
    },
  },
};
