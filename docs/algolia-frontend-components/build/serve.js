const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const server = require('webpack-dev-server');

process.env.webpack = true;

let a = require('./../build/assets');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(process.cwd(), '/build/index.html'),
    inject: true,
  }),
  new webpack.DefinePlugin({
    'assets': JSON.stringify(a)
  }),
]

const config = {
  entry: [
    path.join(process.cwd(),'build/preview.js')
  ],

  output: {
    path: path.resolve(process.cwd(), '/'),
    publicPath: '/',
    filename: '[name].js'
  },

  module: {

    rules: [
      {
        test: /\.(js)$/,
        exclude: [
          /node_modules/
        ],
        loader: 'babel-loader',
      }, 
      { 
        test: /\.svg$/,
        use: 'raw-loader'
      },
      {
        test: /\.scss$/,
        use: [ {loader:'style-loader'}, {loader: 'css-loader'}, {loader:'sass-loader'}]
      },
      {
        test: /\.html$/,
        use: [
          {loader: 'html-loader', options: { interpolate: true}}
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      }
    ]
  },

  resolve: {
    modules: ['.', 'node_modules', process.cwd()],
    extensions: [
      '.js',
      '.scss',
      '.svg'
    ]
  },

  plugins: plugins,

  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true
  },
}

module.exports = config;