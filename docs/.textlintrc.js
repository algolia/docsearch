/* eslint-disable import/no-commonjs */
const _ = require('lodash');
const textlintMode = process.env.TEXTLINT_MODE;

const allRules = {
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
};

// Not all rules are automatically fixable, so when running `yarn run
// lint:md:fix`, we only run the one that can be fixed.
const fixableRules = _.pick(allRules, [
  'common-misspellings',
  'en-capitalization',
  'terminology',
]);

module.exports = {
  rules: textlintMode === 'fix' ? fixableRules : allRules,
};
