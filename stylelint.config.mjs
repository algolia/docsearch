/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-no-unsupported-browser-features'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-order',
  ],
  ignoreFiles: ['examples/**/*.css'],
  rules: {
    'selector-class-pattern':
      '^(?:DocSearch-[A-Za-z0-9-]*|inline|floating|is-open|side-right|side-left|sr-only|conversation-history)$',
    'max-nesting-depth': [
      2,
      {
        ignore: ['pseudo-classes'],
        ignoreAtRules: ['media'],
      },
    ],
    'plugin/no-unsupported-browser-features': [
      null,
      {
        severity: 'warning',
      },
    ],
    // Turned off as it comes with a lot of false positives due to it's documented limitations: https://stylelint.io/user-guide/rules/no-descending-specificity#limitations
    'no-descending-specificity': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme', 'custom-variant'],
      },
    ],
  },
  overrides: [
    {
      files: ['packages/website/**/*.css'],
      rules: {
        'selector-class-pattern': null,
      },
    },
  ],
};
