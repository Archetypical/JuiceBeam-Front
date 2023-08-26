var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');


module.exports = {
  mode: "development",
  watchOptions: {
    poll: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        loader: "file-loader",
        include: [
          path.resolve(__dirname, "../assets/"),
        ],
        options: {
          outputPath: "images",
        },
      },
      {
        test: /\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8080,
  },
  output: {
    filename: "bundle.js",
    publicPath: "/",
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: "http://localhost:4000/api",
    }),
  },
};
