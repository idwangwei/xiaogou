/**
 * utils.js
 */

module.exports = function(grunt) {
    var chalk = require('chalk');

    grunt.exit = function() {
        grunt.task.requires(Array.prototype.slice.call(arguments));
    };

    grunt.checkExec = function(a, b, msg) {
        if(a){
            console.log(a, b);
            grunt.exit("命令执行出错，可能被其它程序占用了！ " + msg);
        }
    };

    /**
     * 获取	平台名字
     */
    grunt.getPlatformName = function() {
        var DEFAULT_PLATFORM_NAME = "ios-android-win";
        var _p = grunt.option('platform');

        return (_p === "ios" || _p==="android" || _p === "win")
            ? _p
            : DEFAULT_PLATFORM_NAME;

        // ========================================

        var platform;
        if(grunt.isPlatformIOS()) platform = "ios";
        else if(grunt.isPlatformAndroid()) platform = "android";
        else if(grunt.isPlatformWin()) platform = "win";
        else console.error("未识别的平台");

        return platform;
    };

    grunt.isPlatformIOS = function() {
        return global.cfg.isIOS;
    };

    grunt.isPlatformAndroid = function() {
        return !(grunt.isPlatformIOS() || grunt.isPlatformWin() || grunt.isPlatformMac()) ;
    };

    grunt.isPlatformWin = function() {
        return global.cfg.isWin;
    };

    grunt.isPlatformMac = function() {
        return global.cfg.isMac;
    };

    /**
     * 获取远程调用的方法参数
     */
    grunt.getUrlRemoteParams = function (param) {
        var urlParam = '';

        Object.keys(param).forEach(function(key){
            urlParam += '&' + key + "=" + param[key];
        });

        return urlParam.replace(/^&/, '?');
    }

    grunt.chalk = function(){
        console.log(chalk.cyan(Array.prototype.slice.call(arguments)));
    };

    grunt.chalk.log = function() {
        grunt.chalk(Array.prototype.slice.call(arguments));
    }
};