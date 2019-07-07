import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

const version =
  process.env.VERSION || `UNRELEASED (${new Date().toUTCString()})`;
const algolia = '© Algolia, Inc. and contributors; MIT License';
const link = 'https://github.com/algolia/docsearch';
const banner = `/*! DocSearch DownShift Renderer ${version} | ${algolia} | ${link} */`;

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  }),
  commonjs({
    namedExports: {
      'react-is': ['isForwardRef'],
    },
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.RESET_APP_DATA_TIMER': JSON.stringify(undefined),
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.ts', '.tsx'],
    rootMode: 'upward',
  }),
  terser(),
  license({
    banner,
  }),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];

const configuration = {
  input: pkg.source,
  output: {
    file: pkg['umd:main'],
    name: 'docsearchDownshiftRenderer',
    format: 'umd',
    sourcemap: true,
  },
  plugins,
};

export default configuration;
