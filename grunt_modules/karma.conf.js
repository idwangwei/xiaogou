/**
 * Created by 彭建伦 on 2016/3/31.
 */


module.exports = function (config) {
    if (!config.set) return; //该文件会被gruntfile的grunt.loadTasks方法加载，这里将其过滤，只有当karma加载该文件时，才执行之后的逻辑

    var path = require('path');
    var webpack = require('./webpack');
    var lconfig = require('./../buildCfg/default.js');
    var role = config.role;

    if (!role) {
        console.log('role is not defined!');
        return;
    }

    var testCases,webpackFor;
    switch (role) {
        case "teacher":
            testCases=path.join(global.cfg.ABSOLUTE_BASE_DIR, lconfig.teacher, 'test', 'spec.js');
            webpack.teacher.plugins = [];
            delete webpack.teacher.output;
            webpack.teacher.devtool = "#inline-source-map";
            webpackFor=webpack.teacher;
            break;
        case "student":
            testCases=path.join(global.cfg.ABSOLUTE_BASE_DIR, lconfig.student, 'test', 'spec.js');
            webpack.student.plugins = [];
            delete webpack.student.output;
            webpack.student.devtool = "#inline-source-map";
            webpackFor=webpack.student;
            break;
        case "parent":
            webpack.parent.plugins = [];
            delete webpack.parent.output;
            webpack.parent.devtool = "#inline-source-map";
            testCases=path.join(global.cfg.ABSOLUTE_BASE_DIR, lconfig.parent, 'test', 'spec.js');
            webpackFor=webpack.parent;
            break;
    }

    var preprocessors = {};
    console.log(config.singleRun+'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    preprocessors[testCases] = ['webpack', 'sourcemap'];
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [testCases],
        exclude: ['karma.conf.js'],
        reporters: ['progress', 'coverage'],
        preprocessors: preprocessors,
        coverageReporter: {
            type: 'lcov',
            dir: './../testReports/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        captureTimeout: 60000,
        singleRun: config.singleRun,
        plugins: [
            require("karma-webpack"),
            require("karma-coverage"),
            require("karma-jasmine"),
            require("karma-chrome-launcher"),
            require("karma-sourcemap-loader")
        ],
        webpack:webpackFor,
        webpackMiddleware: {
            noInfo: true
        }
    });
};
