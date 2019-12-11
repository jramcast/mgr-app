const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let API_URL = "https://9f1a5f0e-03f3-4dd4-b222-a314c9eea74d.pub.cloud.scaleway.com";
// if (process.env.BUILD_ENV === "development") {
//     API_URL = "http://localhost:5000";
// }

module.exports = {
    mode: process.env.BUILD_ENV,
    entry: "./source/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    configFile: "tsconfig.build.json"
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Music Genre Classification DEMO",
            template: "source/index.html"
        }),
        new webpack.DefinePlugin({
            API_URL: JSON.stringify(API_URL)
        }),
        // new BundleAnalyzerPlugin()
    ],
    devtool: "inline-source-map",

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};