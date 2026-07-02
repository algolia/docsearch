import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/DocSearchButton.d.ts',
    output: [{ file: 'dist/esm/DocSearchButton.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/DocSearchModal.d.ts',
    output: [{ file: 'dist/esm/DocSearchModal.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
