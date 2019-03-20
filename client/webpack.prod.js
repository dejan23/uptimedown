const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
      })
    ],
  },
  plugins: [
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['public/dist', 'public/*.html']}),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '../index.html',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
  ]
});