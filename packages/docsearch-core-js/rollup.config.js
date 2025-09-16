import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';

import { plugins } from '../../rollup.base.config';
import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
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
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
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
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    external: (id) => /^(react|react-dom|@types\/react|@ai-sdk\/react)/.test(id),
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
  },
];
