const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev'),
    clean: true,
  },

  devServer: {
    open: true,
    port: 5000,
  },

  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
});
