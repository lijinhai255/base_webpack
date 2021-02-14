const {
    join
} = require('path');
const CopyPlugin = require("copy-webpack-plugin")
const minify = require('html-minifier').minify;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    output: {
        path: join(__dirname, '../dist/assets'),
        filename: "scripts/[name].[contenthash:5].bundle.js"
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
      },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: join(__dirname, '../src/web/views/layouts/layout.html'),
                to: "../views/layouts/layout.html"
            },
            {
                from: join(__dirname, '../src/web/components/**/*.html'),
                to: "../components",
                transform(content, absoluteFrom) {
                    let result = minify(content.toString('utf-8'), {
                        collapseWhitespace: true
                    })
                    return result;
                },
                transformPath(targetPath, absolutePath) {
                    return targetPath.replace('src/web/components', '');
                },
            },
            ],
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })
    ]
}