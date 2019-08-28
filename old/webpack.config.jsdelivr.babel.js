import webpack from 'webpack';
import { join } from 'path';

export default {
  entry: './index.js',
  devtool: 'source-map',
  output: {
    path: join(__dirname, 'dist/cdn'),
    filename: 'docsearch.js',
    library: 'docsearch',
    libraryTarget: 'umd',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};
