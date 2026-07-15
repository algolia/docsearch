import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

import { getBundleBanner } from '../../scripts/getBundleBanner.ts';
import { defines, pkgExports } from '../../tsdown.base.ts';

import pkg from './package.json' with { type: 'json' };

const externals = [
  'react',
  'react-dom',
  /^react\//,
  '@docsearch/core',
  /^@docsearch\/react/,
];

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
    ...sharedConfig,
    dts: true,
    format: 'esm',
    minify: false,
    entry: {
      index: 'src/index.ts',
      button: 'src/DocSearchButton.tsx',
      askai: 'src/DocSearchAskAiModal.tsx',
      modal: 'src/DocSearchModal.tsx',
    },
    outDir: 'dist/esm',
    exports: pkgExports,
  },
  {
    ...sharedConfig,
    entry: 'src/index.ts',
    outDir: 'dist/umd',
    banner: getBundleBanner(pkg),
    dts: false,
    globalName: 'DocSearchModal',
    minify: true,
    outputOptions: {
      entryFileNames: '[name].js',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@docsearch/core': 'DocSearchCore',
        '@docsearch/react': 'DocSearchReact',
        '@docsearch/react/askaiModal': 'DocSearchReact',
        '@docsearch/react/button': 'DocSearchReact',
        '@docsearch/react/modal': 'DocSearchReact',
      },
    },
    format: 'umd',
  },
]);
