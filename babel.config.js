/* eslint-disable import/no-commonjs */

module.exports = api => {
  const isTest = api.env('test');
  const modules = isTest ? 'commonjs' : false;
  const targets = {};

  if (isTest) {
    targets.node = true;
  } else {
    targets.browsers = ['last 2 versions', 'ie >= 9'];
  }

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          modules,
          targets,
        },
      ],
    ],
    overrides: [
      {
        test: [
          './packages/docsearch/',
          './packages/docsearch-renderer-downshift',
        ],
        plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]],
      },
      {
        test: ['./packages/docsearch-renderer-downshift'],
        plugins: [
          ['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
          '@babel/plugin-proposal-class-properties',
        ],
      },
    ],
  };
};
