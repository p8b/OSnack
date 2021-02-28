import * as Webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDevelopment = false;
const appName = "OSnack";

export const webpackOptions = {
   devServer(callerDirName: string, port: number) {
      return {
         contentBase: path.join(callerDirName, "build"),
         contentBasePublicPath: "public",
         compress: true,
         https: {
            key: fs.readFileSync(path.join(__dirname, "server/cert/key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "server/cert/cert.pem"))
         },
         port: port,
         open: true,
         openPage: "",
         host: "localhost",
         historyApiFallback: true,
      };
   },
   mode: (isDevelopment ? "development" : "production") as "development" | "production" | "none" | undefined,
   devtool: (isDevelopment ? "eval-source-map" : undefined) as Webpack.Options.Devtool,
   resolve(extentions: string[]) {
      return { extensions: [".js", ".tsx", ".css", ".ts", ...extentions] } as Webpack.Resolve;
   },
   entry(callerDirName: string, entryObjects: Webpack.Entry = {}) {
      return Object.assign({}, {
         index: path.resolve(callerDirName, "src/index.tsx"),
         sharedStyles: path.resolve(__dirname, "src/styles/main.shared.scss"),
         localStyles: path.join(callerDirName, "src/styles/main.scss")
      }, entryObjects);
   },
   output(callerDirName: string) {
      return {
         path: path.resolve(callerDirName, "build"),
         filename: `public/js/${appName}.[name].[hash].bundle.js`,
         publicPath: "/",
      };
   },
   externals(externalObjects: Webpack.ExternalsObjectElement) {
      return Object.assign({},
         {
            "react": "React",
            "react-dom": "ReactDOM",
            "react-router": "ReactRouter",
            "react-router-dom": "ReactRouterDOM",
         }
         , externalObjects);
   },
   module(rules: Webpack.RuleSetRule[]) {
      return {
         rules: [
            {
               test: /\.tsx?$/,
               loader: "babel-loader",
               exclude: [/node_modules/]
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
            ...rules
         ]
      } as Webpack.Module;
   },
   plugins(callerDirName: string, copyPluginsPatterns: any[] = [], webpackPlugins: Webpack.Plugin[] = []) {
      return [
         new CleanWebpackPlugin(),
         new MiniCssExtractPlugin({
            filename: "public/styles/[name].css",
            chunkFilename: "[id].css",
         }),
         new HtmlWebPackPlugin({
            template: path.join(callerDirName, "/public/index.html"),
            filename: "index.html",
            scriptLoading: "defer",
         }),
         new CopyPlugin({
            patterns: [
               {
                  from: path.resolve(callerDirName, "./package.json"),
                  to: path.resolve(callerDirName, `./build/`),
                  transform(content: any) {
                     var jsonContent = JSON.parse(content.toString());
                     delete jsonContent["dependencies"]["osnack-frontend-shared"];
                     //delete jsonContent["devDependencies"];
                     return JSON.stringify(jsonContent);
                  }
               },
               {
                  from: path.resolve(__dirname, "./server/web.config"),
                  to: path.resolve(callerDirName, `./build/`)
               },
               {
                  from: path.resolve(__dirname, "./server/server.js"),
                  to: path.resolve(callerDirName, `./build/`)
               },
               {
                  from: path.resolve(__dirname, "./public/favicon.ico"),
                  to: path.resolve(callerDirName, './build/public/')
               },
               {
                  from: path.resolve(__dirname, "./public/manifest.json"),
                  to: path.resolve(callerDirName, './build/public/')
               },
               {
                  from: path.resolve(__dirname, "./public/images/"),
                  to: path.resolve(callerDirName, './build/public/images/')
               },
               {
                  from: path.resolve(__dirname, "./public/fonts/"),
                  to: path.resolve(callerDirName, './build/public/fonts/')
               }
               , ...copyPluginsPatterns]
         }),
         ...webpackPlugins
      ];
   },
   optimization: ({
      minimize: !isDevelopment,
      minimizer: [new TerserPlugin({
         parallel: true,
         terserOptions: {
            compress: { drop_console: true }
         }
      })],
      splitChunks: { chunks: "all" },
   }) as Webpack.Options.Optimization,
};
