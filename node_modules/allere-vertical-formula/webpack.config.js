/**
 * Created by 彭建伦 on 2016/8/26.
 */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var PAKAGE = require('./package.json');
var banner = `${PAKAGE.name} - ${PAKAGE.version} \r\n${new Date().toString()}`;
var getEntryFiles = function () {
    var fileEntrys = {};
    var fileList = fs.readdirSync(path.join(__dirname, 'src'));
    fileList.forEach(function (file) {
        var name = file.split('.')[0];
        fileEntrys[name] = path.join(__dirname, 'src', file);
    });
    return fileEntrys;
};

module.exports = {
    /*entry: getEntryFiles(),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget:'commonjs2'
    },*/
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
	      {test: /\.(jpg|png|ico|gif)$/, loader: "url-loader?limit=8192&name=images/[name].[ext]"},
	      {test: /\.html$/, loader: "raw-loader"},
	      {test: /\.vue$/, loader: "vue"},
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.BannerPlugin(banner)
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
    }
};
