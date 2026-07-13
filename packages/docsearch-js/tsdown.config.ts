import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner.ts';
import { rolldownPlugins } from '../../tsdown.base.ts';

import pkg from './package.json' with { type: 'json' };

const sharedConfig: UserConfig = {
  entry: 'src/index.ts',
  platform: 'browser',
  target: 'es2017',
  minify: true,
  plugins: rolldownPlugins,
  banner: getBundleBanner(pkg),
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  },
  outExtensions: () => ({
    dts: '.js',
    js: '.js',
  }),
  sourcemap: true,
};

export default defineConfig([
  {
    ...sharedConfig,
    outDir: 'dist/esm',
  },
  {
    ...sharedConfig,
    outDir: 'dist/umd',
    outputOptions: {
      entryFileNames: '[name].js',
      name: 'docsearch',
    },
    format: 'umd',
  },
]);
