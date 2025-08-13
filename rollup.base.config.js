import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

export const plugins = [
  replace({
    preventAssignment: true,
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  }),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    browser: true,
  }),
  babel({
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
