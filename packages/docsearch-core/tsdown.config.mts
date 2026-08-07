import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner.ts';
import { defines, pkgExports } from '../../tsdown.base.ts';

import pkg from './package.json' with { type: 'json' };

const externals = ['react', 'react-dom', /^react\//];

const sharedConfig: UserConfig = {
  platform: 'browser',
  deps: {
    neverBundle: externals,
  },
  target: 'es2017',
  define: defines,
  sourcemap: true,
  outExtensions: () => ({
    js: '.js',
  }),
};

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      useTheme: 'src/useTheme.ts',
      useDocSearchKeyboardEvents: 'src/useDocSearchKeyboardEvents.ts',
      useKeyboardShortcuts: 'src/useKeyboardShortcuts.ts',
    },
    ...sharedConfig,
    dts: true,
    format: 'esm',
    minify: false,
    outDir: 'dist/esm',
    exports: pkgExports,
  },
  {
    entry: 'src/index.ts',
    outDir: 'dist/umd',
    ...sharedConfig,
    banner: getBundleBanner(pkg),
    dts: false,
    globalName: 'DocSearchCore',
    minify: true,
    outputOptions: {
      entryFileNames: '[name].js',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    format: 'umd',
  },
]);
