import path from 'path';

export default {
  entry: './dev/app.js',
  devtool: 'source-map',
  output: {
    path: './dev/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'dev'),
        path.resolve(__dirname, 'scripts')
      ], loader: 'babel'
    }]
  },
  devServer: {
    contentBase: 'dev/',
    host: '0.0.0.0',
    compress: true
  },
  // when module not found, find locally first
  // helps fixing the npm link not working with webpack
  // http://stackoverflow.com/a/33722844/147079
  resolve: {
    fallback: [path.join(__dirname, '..', 'node_modules')]
  },
  // same issue, for loaders like babel
  resolveLoader: {
    fallback: [path.join(__dirname, '..', 'node_modules')]
  }
};
