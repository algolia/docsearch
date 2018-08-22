/* eslint-disable import/no-commonjs */
const remarkMode = process.env.REMARK_MODE;
/**
 * Linting config.
 * Check the followin links for the list of all rules:
 * - https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-consistent
 * - https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-recommended
 * - https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide
 **/
const lintConfig = {
  plugins: [
    'frontmatter',
    'remark-preset-lint-consistent',
    'remark-preset-lint-recommended',
    'preset-lint-markdown-style-guide',

    'lint-no-trailing-spaces', // No trailing spaces
    ['lint-emphasis-marker', '_'], // Italic with _, bold with **
    ['lint-list-item-indent', 'space'], // Indent list items with one space
  ],
};
const fixConfig = {
  settings: {
    emphasis: '_', // Italic with _
    strong: '*', // Bold with *
    listItemIndent: 1, // Indent list items with one space
  },
  plugins: {
    frontmatter: true,
    'reference-links': true,
    'word-wrap': true,
  },
};

const config = remarkMode === 'fix' ? fixConfig : lintConfig;

exports.plugins = config.plugins;
exports.settings = config.settings;
