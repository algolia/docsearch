import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/useTheme.d.ts',
    output: [{ file: 'dist/esm/useTheme.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/useDocSearchKeyboardEvents.d.ts',
    output: [{ file: 'dist/esm/useDocSearchKeyboardEvents.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/useKeyboardShortcuts.d.ts',
    output: [{ file: 'dist/esm/useKeyboardShortcuts.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
