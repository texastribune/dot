const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: process.cwd(),

  entry: path.join(process.cwd(), 'tracker', 'src', 'index'),

  output: {
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
};
