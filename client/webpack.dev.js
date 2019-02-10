 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');
 const path = require('path');
 const Dotenv = require('dotenv-webpack');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 
 module.exports = merge(common, {
   plugins: [
     new Dotenv({
       path: './dev.env', // load this now instead of the ones in '.env'
       safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
       systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
       silent: true // hide any errors
     }),
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
