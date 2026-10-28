import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'node',
  outDir: 'lib',
  outExtensions: () => ({
    js: '.js',
    dts: '.d.ts',
  }),
  dts: true,
  copy: {
    from: ['src/Search.astro', 'src/virtual.d.ts'],
    to: 'lib',
  },
});
