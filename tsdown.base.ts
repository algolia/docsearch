import { replacePlugin } from 'rolldown/plugins';

export const rolldownPlugins = [
  replacePlugin(
    {
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    {
      preventAssignment: true,
    },
  ),
];
