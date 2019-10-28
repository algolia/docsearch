module.exports = function (context, options) {
  console.log("my loader")
  console.log(process.env.NODE_ENV)
  return {
    name: "loaders",
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.(gif|png|jpe?g|svg)$/i,
              exclude: /[\/]docs[\/]/i,
              use: ["file-loader", { loader: "image-webpack-loader" }]
            }
          ]
        }
      };
    }
  };
};
