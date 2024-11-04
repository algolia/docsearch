export default (api) => {
  const isTest = api.env('test');
  const targets = {};

  if (isTest) {
    targets.node = true;
  } else {
    targets.browsers = ['last 2 versions', 'ie >= 11'];
  }

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets,
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-transform-react-jsx'],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
          },
        },
      ],
    ],
  };
};
