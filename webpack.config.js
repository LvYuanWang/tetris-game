const path = require('path'); // 根据相对路径获取绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入html-webpack-plugin插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 引入clean-webpack-plugin插件

module.exports = {
    entry: './src/index.ts',    // 入口文件
    output: {
        path: path.resolve("./dist"),    // 输出目录
        filename: "script/bundle.js"    // 输出文件
    },
    plugins: [
        // 实例化插件
        new HtmlWebpackPlugin({
            template: './public/index.html',    // 模板文件
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /.ts$/, use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}