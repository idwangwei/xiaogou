
var path = require('path');
var webpack = require('webpack');
var PAKAGE = require('./package.json');
var banner = `${PAKAGE.name} - ${PAKAGE.version} \r\n${new Date().toString()}`;

module.exports = {
    entry: path.join(__dirname, 'index'),
    output: {
        path: 'dist',
        filename: "index.js",
        libraryTarget: 'commonjs2'
    },
    module:{
        loaders: [{
            test: /\.(jpg|png|ico|gif)$/,
            loader: "url-loader?limit=8192?name=images/[name].[ext]"
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel",
            query: {
                presets:["es2015"]
            }
        },{
            test: /\.(less|css)$/,
            loader: "style-loader!css-loader!less-loader"
        }, {
            test: /\.html$/,
            loader: "raw-loader"
        }]
    },
    devtool:'source-map',
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};