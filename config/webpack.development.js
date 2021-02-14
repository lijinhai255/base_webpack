const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
var setIterm2Badge = require('set-iterm2-badge');
const setTitle = require('node-bash-title');
setTitle('开发环境 🍻  Server');
var port = '开发环境🍺';
setIterm2Badge(port);
const ICON = join(__dirname, 'icon.png');
module.exports = {
  devServer: {
    contentBase: './dist',
    hot: true,
    quiet: true
  },
  output: {
    path: join(__dirname, '../dist/assets'),
    filename: 'scripts/[name].bundle.js',
    publicPath: '/',
  },
  
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My Webpack1212 Project",
      suppressSuccess: true, // don't spam success notifications
    }),
    new CopyPlugin({
      patterns: [
        {
          from: join(__dirname, '../src/web/views/layouts/layout.html'),
          to: '../views/layouts/layout.html',
        },
        {
          from: join(__dirname, '../src/web/components/**/*.html'),
          to: '../components',
          transformPath(targetPath, absolutePath) {
            return targetPath.replace('src/web/components', '');
          },
        },
      ],
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:8080'],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: "Webpack error",
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          // icon: ICON
        });
      },
      // default is true
      clearConsole: true,
      additionalTransformers: []
    })
  ],
};
