'use strict';

var path = require('path');

module.exports = {
  cache: true,
  entry: {
    eventPage: './src/eventPage.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
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
  resolve: {
    extensions: ['.ts', '.js']
  }
};
