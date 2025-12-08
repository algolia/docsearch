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
        '@docsearch/core': 'DocSearchCore',
        '@docsearch/react': 'DocSearchReact',
      },
      file: `dist/umd/${fileName}`,
      format: 'umd',
      sourcemap: true,
      name: 'DocSearchModal',
      banner: getBundleBanner(pkg),
    },
    { dir: 'dist/esm', format: 'es' },
  ];
}

const externals = ['react', 'react-dom', '@docsearch/core'];

export default [
  {
    input: 'src/index.ts',
    external: externals,
    output: sourceOutput('index.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/DocSearchButton.tsx',
    external: externals,
    output: sourceOutput('DocSearchButton.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/DocSearchModal.tsx',
    external: externals,
    output: sourceOutput('DocSearchModal.js'),
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
  {
    input: 'dist/esm/types/DocSearchModal.d.ts',
    output: [{ file: 'dist/esm/DocSearchModal.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
