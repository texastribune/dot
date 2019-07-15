const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./config.common');
const {
  ENTRY_PATH,
  BUNDLE_NAME,
  PUBLIC_PATH_PROD,
} = require('./base');

module.exports = merge(commonConfig, {
  entry: ENTRY_PATH,

  output: {
    filename: `${BUNDLE_NAME}.min.js`,
    publicPath: PUBLIC_PATH_PROD,
  },

  plugins: [
    new ExtractTextPlugin('styles.min.css'),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      sourceMap: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
        }),
      },
    ],
  },

  devtool: 'source-map',
});
