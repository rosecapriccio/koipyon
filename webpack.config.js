const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack"); // 👈 安全に.envを読み込むプラグイン

const config = {
  mode: "development", // deploy.yml側の --mode production で本番用に上書きされます
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/assets/", to: "assets/" }],
    }),
    new Dotenv({
      systemvars: true, // 👈 これを入れることでGitHubの環境変数も安全に読み込めます
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
  },
};

module.exports = config;
