const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const commonConfig = require('./config.common');

module.exports = merge(commonConfig, {
  output: {
    path: path.join(process.cwd(), 'tracker', 'public', 'test'),
    filename: 'dot.js',
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
  ],

  devtool: 'inline-source-map',
});
