export default {
  entry: './index.js',
  output: {
    path: './dist/',
    filename: 'documentationsearch.js',
    library: 'documentationSearch',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel'
    }]
  },
  externals: [],
  plugins: []
};
