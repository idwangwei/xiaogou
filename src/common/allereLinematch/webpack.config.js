/**
 * Created by 彭建伦 on 2016/8/26.
 */
var fs = require('fs');
var path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname),
        filename: 'index.js',
        // libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.less$/,
                loader: "style!css!less?strictMath&noIeCompat"
            },
            {
                test: /\.(jpg|png|ico|gif)$/,
                loader: "url-loader?limit=1&name=images/[name].[ext]"
            }
        ]
    }
};
