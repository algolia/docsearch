// rollup.config.js
import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';

import { plugins } from '../../rollup.base.config.js';
import { getBundleBanner } from '../../scripts/getBundleBanner.js';

import pkg from './package.json' with { type: 'json' };

const externalsForTypes = [
  /^preact(\/|$)/,
  /^preact\/jsx-runtime$/,
  /^react(\/|$)/,
  /^react-dom(\/|$)/,
  /^@types\/react(\/|$)/,
  /^@ai-sdk\/react(\/|$)/,
];

export default [
  // ESM JS
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/esm/index.js',
        format: 'es',
        sourcemap: true,
        banner: getBundleBanner(pkg),
      },
    ],
    plugins: [
      ...plugins,
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },

  // UMD JS
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/umd/index.js',
        format: 'umd',
        sourcemap: true,
        name: 'docsearch',
        banner: getBundleBanner(pkg),
      },
    ],
    plugins: [
      ...plugins,
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },

  // Types bundle
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    external: (id) => externalsForTypes.some((rx) => rx.test(id)),
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
  },
];
