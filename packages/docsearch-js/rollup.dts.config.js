import { dts } from 'rollup-plugin-dts';

const externalsForTypes = [
  /^preact(\/|$)/,
  /^preact\/jsx-runtime$/,
  /^react(\/|$)/,
  /^react-dom(\/|$)/,
  /^@types\/react(\/|$)/,
  /^@ai-sdk\/react(\/|$)/,
];

export default [
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/index.d.ts', format: 'es' }],
    external: (id) => externalsForTypes.some((rx) => rx.test(id)),
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
  },
];
