'use strict';

var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  cache: true,
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[chunkhash].bundle.js'
  },
  module: {
    rules: [{
      // if we want to use tsx i.e. jsx we need to add (x?)
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader'
        }
      ]
    }]
  },
  plugins: [
    new CopyWebpackPlugin([ 
        { from: 'src/**', to: path.resolve(__dirname, './dist'), flatten: true }
    ], {ignore: [ '*.ts']})
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
};