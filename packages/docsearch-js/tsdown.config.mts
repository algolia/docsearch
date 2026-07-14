import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner.ts';
import { defines } from '../../tsdown.base.ts';

import pkg from './package.json' with { type: 'json' };

const sharedConfig: UserConfig = {
  entry: 'src/index.ts',
  platform: 'browser',
  target: 'es2017',
  define: defines,
  banner: getBundleBanner(pkg),
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  },
  outExtensions: () => ({
    js: '.js',
  }),
  sourcemap: true,
  deps: {
    alwaysBundle: [/^@docsearch\/(react|core)/],
    dts: {
      alwaysBundle: [],
    },
    onlyBundle: false,
  },
};

export default defineConfig([
  {
    ...sharedConfig,
    dts: true,
    format: 'esm',
    outDir: 'dist/esm',
    minify: false,
  },
  {
    ...sharedConfig,
    dts: false,
    globalName: 'docsearch',
    outDir: 'dist/umd',
    outputOptions: {
      entryFileNames: '[name].js',
    },
    format: 'umd',
    minify: true,
  },
]);
