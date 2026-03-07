// eslint-disable-next-line import/no-extraneous-dependencies
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

import { plugins } from '../../rollup.base.config';
import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json';

const sourcePlugins = [
  commonjs(),
  ...plugins,
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
];

function sourceOutput(fileName) {
  return [
    {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@docsearch/core': 'DocSearchCore',
      },
      file: `dist/umd/${fileName}`,
      format: 'umd',
      sourcemap: true,
      name: 'DocSearchReact',
      banner: getBundleBanner(pkg),
    },
    { dir: 'dist/esm', format: 'es' },
  ];
}

const externalPackages = ['react', 'react-dom', '@docsearch/core'];

export default [
  {
    input: 'src/index.ts',
    external: externalPackages,
    output: sourceOutput('index.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/DocSearchButton.tsx',
    external: externalPackages,
    output: sourceOutput('DocsearchButton.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/DocSearchModal.tsx',
    external: externalPackages,
    output: sourceOutput('DocSearchModal.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/useDocSearchKeyboardEvents.ts',
    external: externalPackages,
    output: sourceOutput('useDocSearchKeyboardEvents.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/useTheme.tsx',
    external: externalPackages,
    output: sourceOutput('useTheme.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/version.ts',
    output: sourceOutput('version.js'),
    plugins: sourcePlugins,
  },
  {
    input: 'src/Sidepanel.tsx',
    external: externalPackages,
    output: sourceOutput('Sidepanel.js'),
    plugins: sourcePlugins,
  },
];
