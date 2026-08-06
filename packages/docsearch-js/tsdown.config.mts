import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner.ts';
import { defines } from '../../tsdown.base.ts';

import pkg from './package.json' with { type: 'json' };

const sharedConfig: UserConfig = {
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
    entry: 'src/index.ts',
    dts: true,
    format: 'esm',
    outDir: 'dist/esm',
    minify: false,
  },
  {
    ...sharedConfig,
    clean: false,
    entry: 'src/docsearch.ts',
    dts: true,
    format: 'esm',
    outDir: 'dist/esm',
    minify: false,
  },
  {
    ...sharedConfig,
    entry: 'src/index.ts',
    dts: false,
    globalName: 'docsearch',
    outDir: 'dist/umd',
    outputOptions: {
      entryFileNames: '[name].js',
    },
    format: 'umd',
    minify: true,
  },
  {
    ...sharedConfig,
    entry: 'src/docsearch.ts',
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
