const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },

      {
        test: /\.(png|svg|jpg|jpeg|ico|gif|webp)$/i,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
      },

      {
        test: /\.mp4/,
        type: 'asset/resource',
        generator: {
          filename: 'video/[hash][ext][query]',
        },
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      inject: 'body',
    }),
  ],
};
