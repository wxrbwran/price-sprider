const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

module.exports = merge(webpackBaseConfig, {
  devtool: '#source-map',
  output: {
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.js',
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/template/index.ejs',
      inject: 'body',
    }),
  ],
});
