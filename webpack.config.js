/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';
const DASHBOARD_BUILD_PATH = path.join(process.cwd(), 'dist');
const DASHBOARD_STATIC_ALIAS = '/static/';
const DASHBOARD_MANIFEST_FILE_NAME = 'assets.json';

const config = {
  mode: IS_DEV ? 'development' : 'production',

  devtool: IS_DEV ? 'eval-source-map' : 'source-map',

  entry: './dashboard',

  output: {
    chunkFilename: '[name].chunk.[contenthash].js',
    filename: IS_DEV ? '[name].js' : '[name].[contenthash].js',
    path: DASHBOARD_BUILD_PATH,
    publicPath: IS_DEV ? '/' : DASHBOARD_STATIC_ALIAS,
  },

  plugins: [
    new VueLoaderPlugin(),
    new MomentLocalesPlugin(),
    new MomentTimezoneDataPlugin({
      startYear: 2017,
      endYear: new Date().getFullYear(),
      matchZones: 'America/Chicago',
    }),
    new EnvironmentPlugin(['APP_URL', 'AUTH0_DOMAIN', 'AUTH0_CLIENT_ID']),
    new WebpackAssetsManifest({
      entrypoints: true,
      output: DASHBOARD_MANIFEST_FILE_NAME,
      publicPath: true,
    }),
  ],

  resolve: {
    extensions: ['.js', '.ts'],
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
          configFile: path.join(process.cwd(), 'dashboard', 'tsconfig.json'),
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
