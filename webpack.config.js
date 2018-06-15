const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopywebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
module.exports = {
  context: __dirname,
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),

    // Needes to compile multiline strings in Cesium
    sourcePrefix: ''
  },
  amd: {
    toUrlUndefined: true
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, cesiumSource)
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      },{
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader']
      },{
        test: /\.js$/,
        include: path.resolve(__dirname, cesiumSource),
        use: [{
          loader: 'strip-pragma-loader',
          options: {
            pragmas: {
              debug: false
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopywebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
    new CopywebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
    new CopywebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify('')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'cesium',
      minChunks: module => module.context && module.context.indexOf('cesium') !== -1
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist")
  },
  devtool: 'eval'
}