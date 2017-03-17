import { join } from 'path';

export default {
  entry: './dev/app.js',
  devtool: 'source-map',
  output: {
    path: join(__dirname, 'dev/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devServer: {
    contentBase: 'dev/',
    host: '0.0.0.0',
    compress: true,
  },
};
