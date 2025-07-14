export default function () {
  return {
    name: 'loaders',
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.(gif|png|jpe?g|svg|webp)$/i,
              exclude: /\.(mdx?)$/i,
              use: ['file-loader', { loader: 'image-webpack-loader' }],
            },
          ],
        },
      };
    },
  };
}
