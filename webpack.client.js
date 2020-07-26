const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
    target: 'node',
    mode: 'production',
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
    plugins: [
        new MiniCssExtractPlugin(),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8
        }),
        new BrotliPlugin({ //brotli plugin
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
}