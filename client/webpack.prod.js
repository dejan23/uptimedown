const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
 plugins: [
   new CleanWebpackPlugin(['public/dist', 'public/*.html']),
   new Dotenv(),
   new HtmlWebpackPlugin({
     template: './src/index.html',
     filename: '../index.html'
   }),
   new MiniCssExtractPlugin({
     filename: 'style.css',
     chunkFilename: '[id].css',
   }),
   new UglifyJSPlugin({
     sourceMap: true
   }),
   new webpack.DefinePlugin({
     'process.env.NODE_ENV': JSON.stringify('production')
   })
 ]
});
