import 'webpack-dev-server';
import * as Webpack from 'webpack';
import { webpackOptions } from './node_modules/osnack-frontend-shared/settings';

const config: Webpack.Configuration = {
   devServer: webpackOptions.devServer(__dirname, 8081),
   mode: webpackOptions.mode,
   devtool: webpackOptions.devtool,
   resolve: webpackOptions.resolve([]),
   entry: webpackOptions.entry(__dirname),
   output: webpackOptions.output(__dirname),
   externals: webpackOptions.externals({}),
   module: webpackOptions.module([]),
   plugins: webpackOptions.plugins(__dirname),
   optimization: webpackOptions.optimization,
};
export default config;
