module.exports = function(context, options) {
  return {
    name: 'loaders',
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            { test: /\.svg$/, use: 'svg-loader' },
            { test: /\.(gif|png|jpe?g)$/i,
             use: ['file-loader',{ loader: 'image-webpack-loader' }]
            }
          ]
        }
      }
    }
  }
};
