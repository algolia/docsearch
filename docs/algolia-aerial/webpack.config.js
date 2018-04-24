const path = require('path');
const ExtractTextPlugin =  require('extract-text-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  entry: './src/stylesheet/aerial.sass',
  output: {
    path: path.join(__dirname, './dist/'),
    filename: 'aerial-source.css'
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('aerial-source.css'), // css file will override generated js file
    new WebpackAutoInject({
        NAME: 'Aerial.css',
        SHORT: 'Aerial.css',
        SILENT: false,
        PACKAGE_JSON_PATH: './package.json',
        components: {
          AutoIncreaseVersion: false,
          InjectAsComment: true,
          InjectByTag: false
        },
        componentsOptions: {
          AutoIncreaseVersion: {
            runInWatchMode: false // it will increase version with every single build!
          },
          InjectAsComment: {
            tag:'version: {version} - {date}', // default
            dateFormat: 'dddd, mmmm dS, yyyy, h:MM:ss TT' // default
          }
        },
        LOGS_TEXT: {
          AIS_START: '\033[32mCompiler Started\033[0m'
        }
      })
    ]
  }