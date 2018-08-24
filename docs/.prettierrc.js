/* eslint-disable import/no-commonjs */
module.exports = {
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        trailingComma: 'es5',
        parser: 'markdown',
      },
    },
  ],
};
