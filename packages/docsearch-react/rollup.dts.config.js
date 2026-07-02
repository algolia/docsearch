import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/DocSearchModal.d.ts',
    output: [{ file: 'dist/esm/DocSearchModal.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/DocSearchButton.d.ts',
    output: [{ file: 'dist/esm/DocSearchButton.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/useDocSearchKeyboardEvents.d.ts',
    output: [{ file: 'dist/esm/useDocSearchKeyboardEvents.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/useTheme.d.ts',
    output: [{ file: 'dist/esm/useTheme.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/version.d.ts',
    output: [{ file: 'dist/esm/version.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/Sidepanel.d.ts',
    output: [{ file: 'dist/esm/Sidepanel.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
