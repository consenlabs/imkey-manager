'use strict'

process.env.BABEL_ENV = 'web'

const path = require('path')
const webpack = require('webpack')

// const BabiliWebpackPlugin = require('babili-webpack-plugin')
const BabiliWebpackPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

let webConfig = {
    // devtool: '#cheap-module-eval-source-map',
    entry: {
        web: path.join(__dirname, '../src/renderer/main.js'),
        worker: path.join(__dirname, '../src/worker/worker.js'),
        polkadotdapp: path.join(__dirname, '../src/api/polkadotdapp.js'),
        ethereumdapp: path.join(__dirname, '../src/api/ethereumdapp.js')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: true,
                        loaders: {
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            less: 'vue-style-loader!css-loader!less-loader'
                        }
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.sass$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, '../src/renderer')],
                exclude: /node_modules/
            },

            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'imgs/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({filename: 'styles.css'}),
        // new HtmlWebpackPlugin({
        //   filename: 'index.html',
        //   template: path.resolve(__dirname, '../src/index.ejs'),
        //   minify: {
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true,
        //     removeComments: true
        //   },
        //   nodeModules: false
        // }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            chunks: ['renderer', 'vendor'],
            templateParameters(compilation, assets, options) {
                return {
                    compilation: compilation,
                    webpack: compilation.getStats().toJson(),
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: options
                    },
                    process,
                };
            },
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: false
        }),
        new webpack.DefinePlugin({
            'process.env.IS_WEB': 'true'
        }),
        new HtmlWebpackPlugin({
            filename: 'worker.html',
            template: path.resolve(__dirname, '../src/worker.ejs'),
            chunks: ['worker', 'vendor'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            templateParameters(compilation, assets, options) {
                return {
                    compilation: compilation,
                    webpack: compilation.getStats().toJson(),
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: options
                    },
                    process,
                };
            },
            nodeModules: process.env.NODE_ENV !== 'production'
                ? path.resolve(__dirname, '../node_modules')
                : false
        }),
        new HtmlWebpackPlugin({
            filename: 'polkadotdapp.html',
            template: path.resolve(__dirname, '../src/polkadotdapp.ejs'),
            chunks: ['polkadotdapp', 'vendor'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            templateParameters(compilation, assets, options) {
                return {
                    compilation: compilation,
                    webpack: compilation.getStats().toJson(),
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: options
                    },
                    process,
                };
            },
            nodeModules: process.env.NODE_ENV !== 'production'
                ? path.resolve(__dirname, '../node_modules')
                : false
        }),
        new HtmlWebpackPlugin({
            filename: 'ethereumdapp.html',
            template: path.resolve(__dirname, '../src/ethereumdapp.ejs'),
            chunks: ['ethereumdapp', 'vendor'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            templateParameters(compilation, assets, options) {
                return {
                    compilation: compilation,
                    webpack: compilation.getStats().toJson(),
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: options
                    },
                    process,
                };
            },
            nodeModules: process.env.NODE_ENV !== 'production'
                ? path.resolve(__dirname, '../node_modules')
                : false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/web'),
        publicPath: './'
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/renderer'),
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue', '.json', '.css']
    },
    target: 'web'
}

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    // webConfig.devtool = ''

    webConfig.plugins.push(
        new BabiliWebpackPlugin(),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {  from: path.join(__dirname, '../static'),
                        to: path.join(__dirname, '../dist/web/static')},
                ]
            }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    )
}

module.exports = webConfig
