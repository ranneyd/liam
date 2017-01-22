'use strict';

var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  cache: true,
  entry: {
    eventPage: './src/eventPage.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[chunkhash].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          { loader: 'ts-loader'}
        ]
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
        { from: 'src/**', to: path.resolve(__dirname, './dist'), flatten: true }
    ], {ignore: [ '*.ts', '*.scss', '*.pug']})
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};
