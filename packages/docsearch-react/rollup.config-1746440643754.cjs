'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var replace = require('@rollup/plugin-replace');
var pluginBabel = require('@rollup/plugin-babel');
var json = require('@rollup/plugin-json');
var resolve = require('@rollup/plugin-node-resolve');
var terser = require('@rollup/plugin-terser');
var rollupPluginDts = require('rollup-plugin-dts');
var filesize = require('rollup-plugin-filesize');
var child_process = require('child_process');
var pkg = require('./package.json');

const plugins = [
  replace({
    preventAssignment: true,
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  }),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    browser: true,
  }),
  pluginBabel.babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    rootMode: 'upward',
  }),
  terser(),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];

const typesConfig = {
  input: 'dist/esm/types/index.d.ts',
  output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
  plugins: [rollupPluginDts.dts()],
};

function getBundleBanner(pkg) {
  const lastCommitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();
  const version = process.env.SHIPJS ? pkg.version : `${pkg.version} (UNRELEASED ${lastCommitHash})`;
  const authors = '© Algolia, Inc. and contributors';

  return `/*! ${pkg.name} ${version} | MIT License | ${authors} | ${pkg.homepage} */`;
}

var rollup_config = [
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
    output: [
      {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        file: 'dist/umd/index.js',
        format: 'umd',
        sourcemap: true,
        name: pkg.name,
        banner: getBundleBanner(pkg),
      },
      { dir: 'dist/esm', format: 'es' },
    ],
    plugins: [
      ...plugins,
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },
  typesConfig,
];

exports.default = rollup_config;
