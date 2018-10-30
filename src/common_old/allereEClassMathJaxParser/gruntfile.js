module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    //mainConfigFile: "./app/scripts/main.js",
                    out: "./app/release/release.js",
                    optimize: "none",
                    name: 'main',
                    paths:{
                        app:'./app/scripts/app'
                    }
                }
            }
        }
    });
    grunt.registerTask('release', 'requirejs')
};