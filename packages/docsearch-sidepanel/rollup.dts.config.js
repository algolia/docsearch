import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/SidepanelButton.d.ts',
    output: [{ file: 'dist/esm/SidepanelButton.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: 'dist/esm/types/Sidepanel.d.ts',
    output: [{ file: 'dist/esm/Sidepanel.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
