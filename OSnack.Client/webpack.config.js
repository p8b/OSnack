const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const isDevelopment = false;
const appName = "osnack";
const outputPublicPath = "./build/public/";

module.exports = {
   mode: isDevelopment ? "development" : "production",
   devtool: isDevelopment && "eval-source-map",
   entry: {
      index: "./src/index.tsx",
      sharedStyles: "osnack-frontend-shared/src/styles/main.shared.scss",
      localStyles: "./src/styles/main.scss"
   },
   resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"]
   },
   output: {
      path: path.resolve(__dirname, "build"),
      // filename: `public/js/${appName}.[name].[fullhash].bundle.js`,
      filename: `public/js/${appName}.[name].[hash].bundle.js`,
      publicPath: "/",
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "babel-loader",
            exclude: /node_modules\/(?!osnack-frontend-shared\/).*/,
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
               { loader: 'css-loader', options: { url: false } },
               { loader: 'sass-loader' }
            ],
         },
         {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
         },
      ]
   },
   devServer: {
      contentBase: path.join(__dirname, "build"),
      contentBasePublicPath: "public",
      //static: [{
      //   directory: path.join(__dirname, "build"),
      //   publicPath: "/public",
      //}],
      compress: true,
      https: {
         key: fs.readFileSync('server/cert/key.pem'),
         cert: fs.readFileSync('server/cert/cert.pem')
      },
      //firewall: false,
      port: 8080,
      open: true,
      openPage: "",
      host: "localhost",
      historyApiFallback: true,
   },
   externals: {
      "react": "React",
      "react-dom": "ReactDOM",
      "react-router": "ReactRouter",
      "react-router-dom": "ReactRouterDOM",
   },
   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
         parallel: true,
         terserOptions: {
            compress: {
               drop_console: true,
            }
         }
      })],
      splitChunks: {
         chunks: "all",
      },
   },
   plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
         filename: "public/styles/[name].css",
         chunkFilename: "[id].css",

      }),
      new HtmlWebPackPlugin({
         template: "./public/index.html",
         filename: "index.html",
         scriptLoading: "defer",
      }),
      new CopyPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, "./package.json"),
               to: path.resolve(__dirname, `./build/`)
            },
            {
               from: path.resolve(__dirname, "./server/web.config"),
               to: path.resolve(__dirname, `./build/`)
            },
            {
               from: path.resolve(__dirname, "./server/server.js"),
               to: path.resolve(__dirname, `./build/`)
            },
            {
               from: path.resolve(__dirname, "node_modules/osnack-frontend-shared/public/favicon.ico"),
               to: path.resolve(__dirname, `${outputPublicPath}`)
            },
            {
               from: path.resolve(__dirname, "node_modules/osnack-frontend-shared/public/manifest.json"),
               to: path.resolve(__dirname, `${outputPublicPath}`)
            },
            {
               from: path.resolve(__dirname, "node_modules/osnack-frontend-shared/public/images/"),
               to: path.resolve(__dirname, `${outputPublicPath}images/`)
            },
            {
               from: path.resolve(__dirname, "node_modules/osnack-frontend-shared/public/fonts/"),
               to: path.resolve(__dirname, `${outputPublicPath}fonts/`)
            },
            {
               from: path.resolve(__dirname, "public/images/"),
               to: path.resolve(__dirname, `${outputPublicPath}images/`)
            },
            {
               from: path.resolve(__dirname, "public/markdowns/"),
               to: path.resolve(__dirname, `${outputPublicPath}markdowns/`)
            },
            {
               from: path.resolve(__dirname, "public/robots.txt"),
               to: path.resolve(__dirname, `${outputPublicPath}`)
            },
         ]
      }),
      //new WorkboxPlugin.GenerateSW({
      //   cacheId: "OSnackAppCacheV1",
      //   clientsClaim: true,
      //   skipWaiting: true,
      //   navigateFallback: "/index.html",
      //   additionalManifestEntries: ['https://localhost:44358/Category/Get/AllPublic'],
      //   cleanupOutdatedCaches: true,
      //   inlineWorkboxRuntime: true,
      //   sourcemap: false,
      //}),
   ],
};
