module.exports = function (_context, _options) {
  return {
    name: 'loaders',
    configureWebpack(_config, _isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.(gif|png|jpe?g|svg)$/i,
              exclude: /\.(mdx?)$/i,
              use: ['file-loader', { loader: 'image-webpack-loader' }],
            },
          ],
        },
      };
    },
  };
};
