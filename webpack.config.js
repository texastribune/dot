/* eslint-disable */

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');

const {
  IS_DEV,
  DASHBOARD_BUILD_PATH,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_MANIFEST_FILE_NAME,
  DASHBOARD_TSCONFIG_PATH,
} = require('./config');

const config = {
  mode: IS_DEV ? 'development' : 'production',

  entry: './dashboard',

  output: {
    chunkFilename: '[name].chunk.[contenthash].js',
    filename: IS_DEV ? '[name].js' : '[name].[contenthash].js',
    path: DASHBOARD_BUILD_PATH,
    publicPath: DASHBOARD_STATIC_ALIAS,
  },

  plugins: [
    new VueLoaderPlugin(),
    new EnvironmentPlugin(['API_HOST', 'NODE_ENV']),
    new WebpackAssetsManifest({
      entrypoints: true,
      output: DASHBOARD_MANIFEST_FILE_NAME,
      publicPath: true,
    }),
  ],

  resolve: {
    extensions: ['.js'],
  },

  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: DASHBOARD_TSCONFIG_PATH,
        },
      },
    ],
  },
};

const extraPlugins = [];
const cssRule = {
  test: /\.s[ac]ss$/i,
  use: ['css-loader', 'sass-loader'],
};

if (IS_DEV) {
  cssRule.use.unshift('vue-style-loader');
} else {
  cssRule.use.unshift(MiniCssExtractPlugin.loader);

  extraPlugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].chunk.[contenthash].css',
    })
  );

  config.optimization = {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  };
}

config.module.rules.push(cssRule);

extraPlugins.forEach((plugin) => {
  config.plugins.push(plugin);
});

module.exports = config;
