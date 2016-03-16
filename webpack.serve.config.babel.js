import webpack from 'webpack';
import {join} from 'path';

export default {
  entry: './index.js',
  devtool: 'source-map',
  output: {
    path: './dist/cdn',
    filename: 'docsearch.js',
    library: 'docsearch',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel'
    }]
  },
  devServer: {
    contentBase: 'dist/cdn',
    host: '0.0.0.0',
    compress: true
  },
  // when module not found, find locally first
  // helps fixing the npm link not working with webpack
  // http://stackoverflow.com/a/33722844/147079
  resolve: {
    fallback: [join(__dirname, '..', 'node_modules')]
  },
  // same issue, for loaders like babel
  resolveLoader: {
    fallback: [join(__dirname, '..', 'node_modules')]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
