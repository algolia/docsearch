import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner';
import { rolldownPlugins } from '../../tsdown.base';

import pkg from './package.json' with { type: 'json' };

const externals = ['react', 'react-dom'];

const sharedConfig: UserConfig = {
  platform: 'neutral',
  external: externals,
  target: 'es2017',
  minify: true,
  plugins: rolldownPlugins,
  sourcemap: true,
  outExtensions: () => ({
    dts: '.js',
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
    outDir: 'dist/esm',
  },
  {
    entry: 'src/index.ts',
    outDir: 'dist/umd',
    ...sharedConfig,
    banner: getBundleBanner(pkg),
    outputOptions: {
      entryFileNames: '[name].js',
      name: 'DocSearchCore',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    format: 'umd',
  },
]);
