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

const externals = ['react', 'react-dom', '@docsearch/core'];

export default [
  {
    input: 'src/index.ts',
    external: externals,
    output: sourceOutput('index.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/SidepanelButton.tsx',
    external: externals,
    output: sourceOutput('SidepanelButton.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/Sidepanel.tsx',
    external: externals,
    output: sourceOutput('Sidepanel.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/SidepanelButton.d.ts',
    output: [{ file: 'dist/esm/SidepanelButton.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/Sidepanel.d.ts',
    output: [{ file: 'dist/esm/Sidepanel.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
