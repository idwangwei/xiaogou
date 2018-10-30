/**
 * Created by LuoWen on 20170113
 */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var PACKAGE = require('./package.json');
var banner = `${PACKAGE.name} - ${PACKAGE.version} \r\n${new Date().toString()}`;

module.exports = {
    entry: path.join(__dirname, 'index.js'),
    output: {
       path: path.join(__dirname, 'dist'),
       filename: 'index.js',
       libraryTarget: 'commonjs2'
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
            },
	        {
              test: /\.less$/,
              loader :'style!css!less'
           }, 
	      {test: /\.(jpg|png|ico|gif)$/, loader: "url-loader?limit=81920&name=images/[name].[ext]"},
	      {test: /\.html$/, loader: "raw-loader"},
	      {test: /\.vue$/, loader: "vue"},
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
