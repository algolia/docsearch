module.exports = function (_context, _options) {
  return {
    name: 'postcss-tailwindcss-loader',
    configureWebpack(_config, _isServer, _utils) {
      return {
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-import'),
                      require('tailwindcss'),
                      require('postcss-preset-env')({
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 4,
                      }),
                    ],
                  },
                },
              ],
            },
          ],
        },
      };
    },
  };
};
