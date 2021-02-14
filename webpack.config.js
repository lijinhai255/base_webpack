// 配置文件
const { argv } = require('yargs');
const { merge } = require('webpack-merge');
const { sync } = require('glob');
const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlAfterPlugin = require('./config/HtmlAfterPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const WebpackBar = require('webpackbar');
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _modeflag = _mode === 'production'?true:false
const files = sync('./src/web/views/**/*.entry.js');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const PATHS = {
  src: path.join(__dirname, 'src')
}
let _entry = {};
let _plugins = [];
for (let item of files) {
  if (/([a-zA-Z]+-[a-zA-Z]+)\.entry.js/.test(item)) {
    const entryKey = RegExp.$1;
    _entry[entryKey] = item;
    const [dist, template] = entryKey.split('-');
    _plugins.push(
      new HtmlWebpackPlugin({
        filename: `../views/${dist}/pages/${template}.html`,
        template: `./src/web/views/${dist}/pages/${template}.html`,
        // books-list
        chunks: ['runtime', entryKey],
        inject: false,
      })
    );
  }
}
const webpackConfig = {
  entry: _entry,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // "cache-loader",
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: _modeflag ?
        'styles/[name].[contenthash:5].css'
        : "styles/[name].css",
      chunkFilename: _modeflag ?
        'styles/[name].[contenthash:5].css'
        : "styles/[name].css"
    }),
    ..._plugins,
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'dist/**/*.html')),
    }),
    new HtmlAfterPlugin(),
    new WebpackBar(),
    // new HardSourceWebpackPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve('./src/web'),
    },
  },
};
module.exports = smp.wrap(merge(webpackConfig, _mergeConfig));
