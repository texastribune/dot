const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const commonConfig = require('./config.common');

module.exports = merge(commonConfig, {
  output: {
    path: path.join(process.cwd(), 'tracker', 'public', 'dist'),
    filename: 'dot.min.[hash].js',
  },

  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      sourceMap: true,
    }),
  ],

  devtool: 'source-map',
});
