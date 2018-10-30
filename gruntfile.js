/**
 * created by pjl on 2015.12.21
 */
var readline = require('readline');
module.exports = function (grunt) {
    var path = require('path');
    //全局常量
    global.cfg = {
        ABSOLUTE_BASE_DIR: path.resolve("./"),
        BASE_DIR: path.join("./"),
        RELEASE_DIR: path.join("./release"),
        RELEASE_TEACHER: path.join('./release/allereEClassForTeacher'),
        RELEASE_PARENT: path.join('./release/allereEClassForParent'),
        RELEASE_STUDENT: path.join('./release/allereEClassForStudent'),
        RELEASE_BASE: path.join('./release/allereEClassCodeBase'),
        CONFIG_LOCATION: path.resolve('./buildCfg/default.js'),
        AUTO_UPDATE_COMMAND_NAME: 'autoUpdate' //打包上传服务器的命令名称
    };

    grunt.config.merge({
        open: {
            delayed: {
                path: 'http://localhost:8080/release'
            }
        }

    });
    //加载load-grunt-tasks插件
    require('load-grunt-tasks')(grunt);

    //加载grunt_modules中的任务
    grunt.loadTasks("./grunt_modules");
    //打包自动更新
    grunt.registerTask(global.cfg.AUTO_UPDATE_COMMAND_NAME,
        function () {
            var runNextTasks = function () {
                grunt.task.run([
                    'beforeBuild'
                    , 'replaceIpAddress'
                    , 'genReleaseByCfg'
                    , 'webpack'
                    , 'replaceBundle'
                    , 'genLogFile'
                    , 'makeVersionManifest'
                    , 'compressZIP'
                    , 'uploadZip'
                    , 'copy4game' 
                ]);
            };
            if (grunt.option('remote')!=false) {
                var done = this.async();
                grunt.log.write("重要的事情说三遍：上传后一定记得预热，然后在群里通知结果！！！！！\n");
                grunt.log.write("重要的事情说三遍：上传后一定记得预热，然后在群里通知结果！！！！！\n");
                grunt.log.write("重要的事情说三遍：上传后一定记得预热，然后在群里通知结果！！！！！\n");
                grunt.log.write("注意！上传远端了，想想还有什么问题，然后输入密码:");

                var rl = readline.createInterface({
                    input: process.stdin,
                    output: null
                });
                rl.on('line', function (input) {
                    done();
                    input == "allere remote upload" ?
                        runNextTasks() : grunt.log.error('password is incorrect!');
                })
            } else {
                runNextTasks();
                
            }

        });

};