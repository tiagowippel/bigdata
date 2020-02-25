const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './frontend/index.jsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        //publicPath: '/', //! não se se precisa
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
        // alias: {
        //     'react-dom': '@hot-loader/react-dom',
        // }, //! não se se precisa
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            //hmr: process.env.NODE_ENV === 'development',
                            //reloadAll: true,
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            modifyVars: {
                                'primary-color': '#2f54eb',
                                'link-color': '#2f54eb',
                                'layout-header-background': '#030852',
                                //'border-radius-base': '2px',
                                // or
                                //hack: `true; @import "your-less-file-path.less";`, // Override with less file
                            },
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        //hot: true,
        port: 3333,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
            },
            '/graphql': {
                target: 'http://localhost:3000',
            },
        },
    },
};
