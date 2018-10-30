/**
 * Created by 彭建伦 on 2016/3/31.
 */
module.exports = function (grunt) {
    var path=require('path');
    var singleRun=grunt.option('singleRun');
    grunt.config.merge({
        karma: {
            teacher: {
                role:'teacher',
                singleRun:singleRun,
                configFile: path.join(__dirname,'karma.conf.js')
            },
            student:{
                role:'student',
                 singleRun:singleRun,
                configFile: path.join(__dirname,'karma.conf.js')
            },
            parent:{
                role:'parent',
                singleRun:singleRun,
                configFile: path.join(__dirname,'karma.conf.js')
            }
        }
    });
};

