const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { EnvironmentPlugin } = require('webpack');

const isDev = process.env.NODE_ENV === "development";

const config = {
  mode: isDev ? "development" : "production",

  entry: "./dashboard",

  output: {
    chunkFilename: "[name].chunk.[contenthash].js",
    filename: "[name].[contenthash].js",
    path: path.join(process.cwd(), "dist"),
    publicPath: "/static/",
  },

  plugins: [
    new VueLoaderPlugin(),
    new EnvironmentPlugin(["API_HOST", "NODE_ENV"]),
    new WebpackAssetsManifest({
      entrypoints: true,
      output: "assets.json",
      publicPath: true,
    }),
  ],

  optimization: {
    runtimeChunk: "single",

    splitChunks: {
      chunks: "all",
      name: false,
    },
  },

  resolve: {
    extensions: [".js", ".ts", ".vue"],
  },

  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: "vue-loader",
      },
      {
        test: /\.ts$/i,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: "tsconfig.client.json",
        },
      },
    ],
  },
};

const extraPlugins = [];
const cssRule = {
  test: /\.s[ac]ss$/i,
  use: ["css-loader", "sass-loader"],
};

if (isDev) {
  cssRule.use.unshift("vue-style-loader");
} else {
  cssRule.use.unshift(MiniCssExtractPlugin.loader);
  extraPlugins.push(
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[name].chunk.[contenthash].css",
    })
  );
}

config.module.rules.push(cssRule);

extraPlugins.forEach(plugin => {
  config.plugins.push(plugin);
});

module.exports = config;
