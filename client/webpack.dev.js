 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 
 module.exports = merge(common, {
   plugins: [
     new HtmlWebpackPlugin({
       template: './src/index.html',
       filename: '../index.html'
     }),
     new MiniCssExtractPlugin({
       filename: 'style.css',
       chunkFilename: '[id].css'
     })
   ],
   devtool: 'inline-source-map',
   devServer: {
     host: '0.0.0.0',
     port: 8080,
     contentBase: path.join(__dirname, 'public'),
     historyApiFallback: true,
     publicPath: '/dist/',
     stats: 'errors-only'
   }
 });
