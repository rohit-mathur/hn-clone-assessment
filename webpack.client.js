const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});


module.exports = {
    target: 'node',
    mode: 'development',
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        filename: 'client_bundle.js',
        path: path.resolve(__dirname, 'build/public'),
        publicPath: '/build/public'
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
                        ['@babel/preset-env']
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
    plugins: [new MiniCssExtractPlugin()]
}