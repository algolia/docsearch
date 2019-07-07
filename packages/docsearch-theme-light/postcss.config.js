/* eslint-disable import/no-commonjs */

const autoprefixer = require('autoprefixer');
const cssVariables = require('postcss-css-variables');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer,
    cssVariables({
      preserve: true,
    }),
    cssnano(),
  ],
};
