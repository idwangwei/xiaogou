/**
 *   找到global.cfg.CONFIG_LOCATION中的
 *
 *        "backend":"ip address"
 *
 *   一行，根据打包时 -remote 选项决定服务器的地址
 *
 */
module.exports = function (grunt) {
    var path = require('path');
    grunt.registerTask('replaceIpAddress', function () {
        if (!grunt.file.exists(global.cfg.CONFIG_LOCATION)) {
            grunt.exit('找不到配置文件：' + path.resolve(global.cfg.CONFIG_LOCATION));
        }
        var ipAddress = '192.168.0.165:9080';
        var imgServer = '192.168.0.165:90';

        // var ipAddress = 'www.xuexix.com:9080';
        // var imgServer = 'www.xuexix.com:90';

        // var ipAddress = '192.168.0.30:9080';
        // var imgServer = '192.168.0.30:90';
        // var ipAddress = '192.168.0.165:9080';
        // var imgServer = '192.168.0.165:90';
        // var ipAddress = '182.140.144.142:9082';
        // var imgServer = 'tx.static.mathfunfunfun.com/static';

        if (grunt.option('ip') === 161) {
            ipAddress = '192.168.0.161:9080';
            imgServer = '192.168.0.161:90';
        }

        if (grunt.option('ip') === 165) {
            ipAddress = '192.168.0.165:9080';
            imgServer = '192.168.0.165:90';
        }

        if (grunt.option('remote')) {
            ipAddress = 'www.xuexix.com:9080';
            imgServer = 'cdn.allere.static.xuexiv.com/static';
        }
        if (grunt.option('ip') === 'test_remote') {
            ipAddress = 'www.alrtest.com:9080';
            imgServer = 'www.alrtest.com/static';
        }

        if (grunt.option('ip') === 'test_xuexihappy') {
            ipAddress = 'www.xuexihappy.com:9080';
            imgServer = 'www.xuexihappy.com/static';
        }

        var cfg = grunt.file.expand(global.cfg.CONFIG_LOCATION)[0];
        var csContentStr = grunt.file.read(cfg);
        var replacedCsContentStr = csContentStr.replace(/("backend"\s*:\s*")(.+)(")/, '$1' + ipAddress + '$3');
        replacedCsContentStr = replacedCsContentStr.replace(/("img_server"\s*:\s*")(.+)(")/, '$1' + imgServer + '$3');
        grunt.file.write(cfg, replacedCsContentStr);
    });
};
