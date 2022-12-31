import replace from '@rollup/plugin-replace';

import { plugins } from '../../rollup.base.config.mjs';
import { getBundleBanner } from '../../scripts/getBundleBanner.mjs';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: {
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
  plugins: [
    ...plugins,
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
