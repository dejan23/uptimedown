 const path = require('path');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 const Dotenv = require('dotenv-webpack');
 const devMode = process.env.NODE_ENV !== 'production'

 module.exports = {
   entry: ['babel-polyfill', './src/app.js'],
   output: {
     path: path.join(__dirname, 'public/dist'),
     publicPath: '/dist/',
     filename: devMode ? 'bundle.js' : 'bundle.[hash].js'
   },
   module: {
     rules: [
       {
         test: /\.js$/,
         exclude: /node_modules/,
         use: {
           loader: 'babel-loader'
         }
       },
       {
         test: /\.html$/,
         use: [
           {
             loader: 'html-loader',
             options: { minimize: true }
           }
         ]
       },
       {
         test: /\.s?css$/,
         use: [
           MiniCssExtractPlugin.loader,
             {
               loader: 'css-loader',
               options: {
                 sourceMap: true
               }
             },
             {
               loader: 'sass-loader',
               options: {
                 sourceMap: true
               }
             }
          ]
       }
     ]
   },
   plugins: [
     new Dotenv()
   ]
 };
