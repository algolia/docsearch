import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

const version =
  process.env.VERSION || `UNRELEASED (${new Date().toUTCString()})`;
const algolia = '© Algolia, Inc. and contributors; MIT License';
const link = 'https://github.com/algolia/docsearch';
const license = `/*! DocSearch.js Autocomplete ${version} | ${algolia} | ${link} */`;

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.ts', '.tsx'],
    rootMode: 'upward',
  }),
  commonjs(),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
  uglify({
    output: {
      preamble: license,
    },
  }),
];

const configuration = {
  input: pkg.source,
  output: {
    file: pkg['umd:main'],
    name: 'docsearchAutocomplete',
    format: 'umd',
    globals: {
      'docsearch.js-core': 'docsearchCore',
    },
    banner: license,
    sourcemap: true,
    exports: 'named',
  },
  plugins,
};

export default configuration;
