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
        NAME: 'AIV custom name',
        SHORT: 'CUSTOM',
        SILENT: false,
        PACKAGE_JSON_PATH: './package.json',
        components: {
          AutoIncreaseVersion: false,
          InjectAsComment: true,
          InjectByTag: true
        },
        componentsOptions: {
          AutoIncreaseVersion: {
            runInWatchMode: false // it will increase version with every single build!
          },
          InjectAsComment: {
            tag: 'Version: {version} - {date}',
            dateFormat: 'h:MM:ss TT'
          },
          InjectByTag: {
            fileRegex: /\.+/,
            dateFormat: 'h:MM:ss TT'
          }
        },
        LOGS_TEXT: {
          AIS_START: 'DEMO AIV started'
        }
      })
    ]
  }