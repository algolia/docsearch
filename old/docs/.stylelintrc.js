/* eslint-disable import/no-commonjs */
// Initially exported from
// https://github.com/stylelint/stylelint-config-recommended/blob/master/index.js
module.exports = {
  plugins: ['stylelint-csstree-validator'],
  rules: {
    // Prettier
    'selector-list-comma-newline-after': 'always',
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'color-hex-case': 'lower',
    'string-quotes': 'double',
    'no-extra-semicolons': true,
    indentation: 2,
    // Tailwind
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'screen'],
      },
    ],
    // Stylelint
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'comment-no-empty': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    'font-family-no-duplicate-names': true,
    'selector-pseudo-class-no-unknown': true,
    // Plugins
    'csstree/validator': true,
    //
    //
    //
    // 'selector-pseudo-element-no-unknown': true,
    // 'selector-type-no-unknown': true,

    // 'declaration-block-no-redundant-longhand-properties': true,
    // 'declaration-block-no-shorthand-property-overrides': true,
    // 'function-calc-no-unspaced-operator': true,
    // 'function-linear-gradient-no-nonstandard-direction': true,
    // 'keyframe-declaration-no-important': true,
    // 'media-feature-name-no-unknown': true,
    // 'no-empty-source': true,
    // 'no-invalid-double-slash-comments': true,
    // 'property-no-unknown': true,
    // 'shorthand-property-no-redundant-values': true,
    // 'string-no-newline': true,
    // 'unit-no-unknown': true,
  },
};
