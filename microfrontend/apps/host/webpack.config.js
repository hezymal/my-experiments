const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const packageJson = require("./package.json");

const { ModuleFederationPlugin } = webpack.container;

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    target: "web",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3001,
    },
    output: {
        publicPath: "auto",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    esmodules: true,
                                },
                            },
                        ],
                        "@babel/preset-react",
                    ],
                },
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "host",
            shared: {
                react: {
                    import: "react",
                    requiredVersion: packageJson.dependencies.react,
                    shareKey: "react",
                    shareScope: "default",
                    singleton: true,
                },
                "react-dom": {
                    requiredVersion: packageJson.dependencies["react-dom"],
                    singleton: true,
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};
