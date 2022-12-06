const path = require('path');
var webpack = require('webpack');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

module.exports = {
    entry: {main: './src/index.js'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    optimization: {
        minimize: true
    },
    devtool: 'source-map',
    devServer: {
        static: path.join(__dirname, 'examples'),
        compress: true,
        port: 9000,
        hot: true
    },
    plugins: [
        new ExtractCssChunks(
            {
                filename: "[name].css",
                chunkFilename: "[id].css",
                orderWarning: true,
            }
        ),
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [

                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.(fasta|clustal)$/,
                use: 'raw-loader',
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ],
    },

    externals: {
        d3: "d3",
        'react': 'React'
    }
};
