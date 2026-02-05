import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner';
import { rolldownPlugins } from '../../tsdown.base';

import pkg from './package.json' with { type: 'json' };

const externals = ['react', 'react-dom', '@docsearch/core', /^@docsearch\/react/];

const sharedConfig: UserConfig = {
  platform: 'neutral',
  external: externals,
  target: 'es2017',
  minify: true,
  plugins: rolldownPlugins,
  outExtensions: () => ({
    dts: '.js',
    js: '.js',
  }),
  sourcemap: true,
};

export default defineConfig([
  {
    ...sharedConfig,
    entry: {
      index: 'src/index.ts',
      SidepanelButton: 'src/SidepanelButton.tsx',
      Sidepanel: 'src/Sidepanel.tsx',
    },
    outDir: 'dist/esm',
  },
  {
    ...sharedConfig,
    entry: 'src/index.ts',
    outDir: 'dist/umd',
    banner: getBundleBanner(pkg),
    outputOptions: {
      entryFileNames: '[name].js',
      name: 'DocSearchSidepanel',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@docsearch/core': 'DocSearchCore',
      },
    },
    format: 'umd',
  },
]);
