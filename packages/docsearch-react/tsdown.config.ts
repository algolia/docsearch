import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner';
import { rolldownPlugins } from '../../tsdown.base';

import pkg from './package.json' with { type: 'json' };

const externals = ['react', 'react-dom', '@docsearch/core'];

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
      DocSearchButton: 'src/DocsearchButton.tsx',
      DocSearchModal: 'src/DocSearchModal.tsx',
      useDocSearchKeyboardEvents: 'src/useDocSearchKeyboardEvents.ts',
      useTheme: 'src/useTheme.tsx',
      version: 'src/version.ts',
      Sidepanel: 'src/Sidepanel.tsx',
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
      name: 'DocSearchReact',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@docsearch/core': 'DocSearchCore',
      },
    },
    format: 'umd',
  },
]);
