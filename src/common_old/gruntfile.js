module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    // grunt 配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            app: {
                cwd: './app',
                src: ['templates/*.html'],
                dest: './app/scripts/templates.js',
                options: {
                    bootstrap: function (module, script) {
                        return 'var module = angular.module("keyboard");module.run(["$templateCache",function($templateCache){'+script+'}])';
                    }
                },

                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            }
        },

        copy: {
            image: {
                files: [
                    {expand: true, flatten: false, cwd: 'app/', src: ['images/**'], dest: 'release/'}
                ]
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            scripts: {
                src: grunt.file.expand('./app/scripts/*.js'),
                dest: 'release/keyboard.js'
            },
            scriptsToFraction: {
                src: grunt.file.expand('./app/scripts/*.js'),
                dest: '../fraction/app/lib/keyboard/keyboard.js'
            },
            css:{
                src:grunt.file.expand('./app/styles/*.css'),
                dest: 'release/keyboard.css'
            },
            cssToFraction:{
                src:grunt.file.expand('./app/styles/*.css'),
                dest: '../fraction/app/lib/keyboard/keyboard.css'
            }
        },
        clean: {
            release: ["release/**"]
        }

    });


    // Production mode tasks
    grunt.registerTask('release', ['ngtemplates', 'clean', 'concat','copy']);

};