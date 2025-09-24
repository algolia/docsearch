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
      name: pkg.name,
      banner: getBundleBanner(pkg),
    },
    { dir: 'dist/esm', format: 'es' },
  ];
}

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom', '@docsearch/core'],
    output: sourceOutput('index.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/DocSearchButton.tsx',
    external: ['react', 'react-dom', '@docsearch/core'],
    output: sourceOutput('DocSearchButton.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/DocSearchButton.d.ts',
    output: [{ file: 'dist/esm/DocSearchButton.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
