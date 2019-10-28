module.exports = function(context, options) {
  return {
    name: 'loaders',
    configureWebpack(config, isServer) {
      console.log("custom loaders")
      console.log(JSON.stringify(config,null, 1))
      console.log(process.env.NODE_ENV)
      return {
        module: {
          rules: [
            {
              test: /\.(gif|png|jpe?g|svg)$/i,
              exclude: /\.(mdx?)$/i,
             use: ['file-loader',{ loader: 'image-webpack-loader' }]
            }
          ]
        }
      }
    }
  }
};
