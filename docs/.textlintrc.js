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
        'relative to', // We need to talk about links "relative to the root"
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
