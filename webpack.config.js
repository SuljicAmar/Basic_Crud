// Node libraries to help us work with the file system
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');

//Responsible for creating our CSS file that is imported into a js file
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Our project directory
const appDirectory = fs.realpathSync(process.cwd());

// Function that turns a relative to absolute path
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);

// Since we are running this in node, this is how we export
module.exports = {
    mode: 'development', //production, development

    // Entry points are the main javascript file for each page.
    entry: resolveAppPath('src/javascript/app.js'),

    // Directory to place our output
    output: {
        path: resolveAppPath('public/build'),
        filename: 'javascript/main.js'
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/main.css' // name of our compiled CSS file
        })
    ],

    module: {
        // This is our build workflow
        rules: [
            {
                // Only process SASS files
                test: /\.scss$/,

                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')
                            ]
                        }
                    }
                }, {
                    loader: 'sass-loader'
                }]
            }
        ]
    }
}