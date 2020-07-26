const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpackNodeExternals = require('webpack-node-externals');
module.exports = {
    target: 'node',
    mode: 'development',
    entry: './server.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                options: {
                    presets: [
                        '@babel/preset-react',
                        ['@babel/preset-env'],
                        // '@babel/preset-stage-0',
                        // ['@babel/preset-env', {
                        //     target:{
                        //         browsers: ["last 2 versions"]
                        //     }
                        // }]
                    ]
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                include: [
                    path.resolve(__dirname, "./src"),
                    // path.resolve(__dirname, "./node_modules")
                ],
            }
        ]
    },
    externals: [webpackNodeExternals()],
    plugins: [new MiniCssExtractPlugin()]
}