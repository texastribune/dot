const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./config.common');
const { ENTRY_PATH, BUNDLE_NAME } = require('./base');

module.exports = merge(commonConfig, {
  entry: [
    'webpack-hot-middleware/client?path=/dashboard/__webpack_hmr',
    ENTRY_PATH,
  ],

  output: {
    filename: `${BUNDLE_NAME}.js`,
    publicPath: '/static/dist/',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devtool: 'inline-source-map',
});
