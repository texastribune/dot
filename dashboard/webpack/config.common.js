const path = require('path');
const DotEnv = require('dotenv-webpack');

const { OUTPUT_PATH } = require('./base');

module.exports = {
  context: process.cwd(),

  output: {
    path: OUTPUT_PATH,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },

      {
        test: /\.vue$/,
        exclude: [/node_modules/],
        loader: 'vue-loader',
      },
    ],
  },

  plugins: [
    new DotEnv({
      path: path.join(process.cwd(), 'env'),
      systemvars: true,
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.vue'],
  },
};
