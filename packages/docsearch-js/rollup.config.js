import replace from '@rollup/plugin-replace';

import { plugins, typesConfig } from '../../rollup.base.config';
import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json';

export default [
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
      {
        file: 'dist/esm/index.js',
        format: 'es',
        sourcemap: true,
        banner: getBundleBanner(pkg),
        plugins: [...plugins],
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
  typesConfig,
];
