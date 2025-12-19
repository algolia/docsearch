// eslint-disable-next-line import/no-extraneous-dependencies
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';

import { plugins } from '../../rollup.base.config';
import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json';

const sourcePlugins = [
  commonjs(),
  ...plugins,
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
];

function sourceOutput(fileName) {
  return [
    {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      file: `dist/umd/${fileName}`,
      format: 'umd',
      sourcemap: true,
      name: 'DocSearchCore',
      banner: getBundleBanner(pkg),
    },
    { dir: 'dist/esm', format: 'es' },
  ];
}

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
    output: sourceOutput('index.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/useTheme.ts',
    external: ['react', 'react-dom'],
    output: sourceOutput('useTheme.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/useDocSearchKeyboardEvents.ts',
    external: ['react', 'react-dom'],
    output: sourceOutput('useDocSearchKeyboardEvents.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/useKeyboardShortcuts.ts',
    external: ['react', 'react-dom'],
    output: sourceOutput('useKeyboardShortcuts.js'),
    plugins: sourcePlugins,
  },
];
