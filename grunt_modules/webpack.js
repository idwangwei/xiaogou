/**
 * Created by pengjianlun on 16-1-27.
 */
module.exports = function (grunt) {
    var DEBUG_OPTION = 'sourceDebug';
    var PRODUCTION_OPTION = "production";
    var TEST_OPTION = 'withTest';
    var path = require('path');
    var webpack = require('webpack');
    var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
    var moduleEntryMap = require('./../buildCfg/module_entry_map');
    var student = {}, teacher = {}, parent = {}, idx = {}, vendor = {};
    var widthTest = grunt.option(TEST_OPTION);
    var devParam = { //开发模式下 家长|教师|学生端对应的参数
        TEACHER: 't',
        STUDENT: 's',
        PARENT: 'p',
        INDEX: 'i',
        VENDOR: 'v'
    };
    var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
    var VAR_CONST = {
            MODULE_ALIAS: grunt.file.readJSON(path.join(__dirname, '../buildCfg/module_alias.json')),
            MODULE_DEF: {
                loaders: [
                    {
                        test: /\.js?$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: 'babel', // 'babel-loader' is also a legal name to reference
                        query: {
                            presets: ['es2015'],
                            plugins: ["transform-decorators-legacy", "transform-class-properties", "transform-export-extensions"]
                        }
                    }
                    , {test: /\.css$/, loader: 'style!css'}
                    , {test: /\.json$/, loader: 'json'}
                    , {test: /\.less/, loader: 'style-loader!css-loader!less-loader'}
                    , {test: /\.woff/, loader: 'url?prefix=font/&limit=10240&mimetype=application/font-woff'}
                    , {test: /\.ttf/, loader: 'file?prefix=font/'}
                    , {test: /\.eot/, loader: 'file?prefix=font/'}
                    , {test: /\.svg/, loader: 'file/'}
                    , {test: /\.(jpg|png|ico|gif)$/, loader: "url-loader?limit=1&name=images/[name].[ext]"}
                    , {test: /\.html$/, exclude: /node_modules/, loader: "raw"}
                    , {test: /\.(ttf|eot|otf|map)$/, loader: "file"}
                    , {test: /\.woff(2)?$/, loader: "url?limit=100000&minetype=application/font-woff"}
                    , {test: /\.vue$/, loader: "vue"}
                    , {test: /\.mp3$/, loader: "file-loader?name=audio/[name].[ext]"}
                    , {test: /\.mpeg|\.mp4|\.webm|\.ogv|\.ogg$/, loader: "file-loader?name=video/[name].[ext]"},
                ]


            },
            PLUGIN_LIST: [
                new webpack.ResolverPlugin(
                    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
                ),
                new webpack.DefinePlugin({
                    PRODUCTION: grunt.option(PRODUCTION_OPTION)
                }),

                /* new webpack.optimize.CommonsChunkPlugin({
                 // name: 'vendor', // 指定一个希望作为公共包的入口
                 // name: 'vendor'
                 names: ['chunk', 'vendor1', 'vendor2', 'vendor3']
                 })*/
            ]

        }
    ;
    // support source maps
    var devtool = "#inline-source-map";

    if (grunt.option(DEBUG_OPTION) != true) {
        VAR_CONST.PLUGIN_LIST = VAR_CONST.PLUGIN_LIST.concat([
            new ngAnnotatePlugin({
                add: true
            }),
            new ParallelUglifyPlugin({
                cacheDir: '.cache/',
                // Optional absolute path to use as a cache. If not provided, caching will not be used.
                workerCount: 40, // Optional int. Number of workers to run uglify. Defaults to num of cpus - 1 or asset count (whichever is smaller)
                uglifyJS: {
                    // These pass straight through to uglify.
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false
                    }
                }
            })
        ]);
    }
    var pkg = require(global.cfg.CONFIG_LOCATION);
    var entry = Object.assign({
        //loading界面
        loading: path.join(__dirname, "../", pkg.student_base, '/commonWidgets/loadingScene.js'),
        //学生
        // student: path.join(__dirname, '../', pkg.student, '/scripts/bootstrap.js'),
        logger: path.join(__dirname, '../', pkg.student_base, 'log_monitor', 'log-monitor.js'),
        tasks: path.join(__dirname, '../', pkg.student, '/modules/m_boot/scripts/redux/tasks/worker.js'),
        tasks2: path.join(__dirname, '../', pkg.student_base, '/picture-drawing/scripts/worker/workerContent.js'),
        //家长
        parent: path.join(__dirname, '../', pkg.parent, '/scripts/bootstrap.js'),

        //教师
        teacher: path.join(__dirname, '../', pkg.teacher, '/scripts/bootstrap.js'),
        //index
        index: path.join(__dirname, '../', pkg.student_base, '/index2.js')
    }, moduleEntryMap);
    vendor = {
        entry: entry,
        output: {
            path: path.join(global.cfg.RELEASE_DIR, 'build'),
            filename: '[name]_bundle.js'
        },
        resolveLoader: {
            root: path.join(__dirname, "../node_modules")
        },
        resolve: {
            root: [
                path.join(__dirname, "../", pkg.modules),
                path.join(__dirname, "../", pkg.student),
                path.join(__dirname, "../", pkg.parent),
                path.join(__dirname, "../", pkg.teacher),
                path.join(__dirname, "../", pkg.student_base),
                path.join(__dirname, "../", 'bower_components'),
                path.join(__dirname, "../", 'buildCfg'),
            ],
            alias: VAR_CONST.MODULE_ALIAS
        },
        module: VAR_CONST.MODULE_DEF,
        plugins: VAR_CONST.PLUGIN_LIST.concat([
            new webpack.optimize.CommonsChunkPlugin({ //所有三端公共类和方法
                name: 'common_spt',// 指定一个希望作为公共包的入口
                chunks: ['student', 'parent', 'teacher'].concat(Object.keys(moduleEntryMap))
            }),
            // new webpack.optimize.CommonsChunkPlugin({//三端公用框架部分
            //     name: 'common_ispt',// 指定一个希望作为公共包的入口
            //     chunks: ['index', 'common_spt']
            // }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'tasks',// 指定一个希望作为公共包的入口
                chunks: ['tasks']
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'tasks2',// 指定一个希望作为公共包的入口
                chunks: ['tasks2']
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'logger',// 指定一个希望作为公共包的入口
                chunks: ['logger']
            })
        ])
    };


    //教师配置
    teacher = {
        entry: {
            teacher: path.join(__dirname, '../', pkg.teacher, '/scripts/bootstrap.js'),
            // teacher: path.join(__dirname, '../', pkg.teacher, '/scripts/data_pipe.js'),
        },
        output: {
            path: path.join(global.cfg.RELEASE_DIR, 'build'),
            filename: '[name]_bundle_[hash].js',
        },
        resolveLoader: {
            root: path.join(__dirname, "../node_modules")
        },
        resolve: {
            root: [
                path.join(__dirname, "../", pkg.modules),
                path.join(__dirname, "../", pkg.teacher),
                path.join(__dirname, "../", pkg.teacher_base),
                path.join(__dirname, "../", 'bower_components'),
                path.join(__dirname, "../", 'buildCfg'),
            ],
            alias: VAR_CONST.MODULE_ALIAS
        },
        module: VAR_CONST.MODULE_DEF,
        plugins: VAR_CONST.PLUGIN_LIST
    };
    //学生配置
    student = {
        entry: {
            logger: path.join(__dirname, '../', pkg.student_base, 'log_monitor', 'log-monitor.js'),
            student: path.join(__dirname, '../', pkg.student, '/scripts/bootstrap.js'),
            // student: path.join(__dirname, '../', pkg.student, '/scripts/controllers/about/about_ctrl.js'),
            tasks: path.join(__dirname, '../', pkg.student, '/scripts/redux/tasks/worker.js'),
            tasks2: path.join(__dirname, '../', pkg.student_base, '/picture-drawing/scripts/worker/workerContent.js'),
        },
        output: {
            path: path.join(global.cfg.RELEASE_DIR, 'build'),
            filename: '[name]_bundle_[hash].js'
        },
        resolveLoader: {
            root: path.join(__dirname, "../node_modules")
        },
        resolve: {
            root: [
                path.join(__dirname, "../", pkg.modules),
                path.join(__dirname, "../", pkg.student),
                path.join(__dirname, "../", pkg.student_base),
                path.join(__dirname, "../", 'bower_components'),
                path.join(__dirname, "../", 'buildCfg'),
            ],
            alias: VAR_CONST.MODULE_ALIAS
        },
        module: VAR_CONST.MODULE_DEF,
        plugins: VAR_CONST.PLUGIN_LIST
    };
    //家长配置
    parent = {
        entry: {
            parent: path.join(__dirname, '../', pkg.parent, '/scripts/bootstrap.js'),
            // parent: path.join(__dirname, '../', pkg.parent, '/scripts/controllers/about/feedback_ctrl.js'),
        },
        output: {
            path: path.join(global.cfg.RELEASE_DIR, 'build'),
            filename: '[name]_bundle_[hash].js'
        },
        resolveLoader: {
            root: path.join(__dirname, "../node_modules")
        },
        resolve: {
            root: [
                path.join(__dirname, "../", pkg.modules),
                path.join(__dirname, "../", pkg.parent),
                path.join(__dirname, "../", pkg.parent_base),
                path.join(__dirname, "../", 'bower_components'),
                path.join(__dirname, "../", 'buildCfg'),
            ],
            alias: VAR_CONST.MODULE_ALIAS
        },
        module: VAR_CONST.MODULE_DEF,
        plugins: VAR_CONST.PLUGIN_LIST
    };
    //主页配置
    idx = {
        entry: path.join(__dirname, '../', pkg.teacher_base, '/index2.js'),
        output: {
            path: path.join(global.cfg.RELEASE_DIR, 'build'),
            filename: 'index_bundle_[hash].js'
        },
        resolveLoader: {
            root: path.join(__dirname, "../node_modules")
        },
        resolve: {
            root: [
                path.join(__dirname, "../", pkg.modules),
                path.join(__dirname, "../", pkg.student),
                path.join(__dirname, "../", pkg.parent),
                path.join(__dirname, "../", pkg.teacher),
                path.join(__dirname, "../", pkg.student_base),
                path.join(__dirname, "../", 'bower_components'),
                path.join(__dirname, "../", 'buildCfg'),
            ],
            alias: VAR_CONST.MODULE_ALIAS
        },
        module: VAR_CONST.MODULE_DEF,
        plugins: VAR_CONST.PLUGIN_LIST,
    };


    if (grunt.option(DEBUG_OPTION) == true) {
        teacher.devtool = devtool;
        student.devtool = devtool;
        parent.devtool = devtool;
        idx.devtool = devtool;
        vendor.devtool = devtool;
    }

    grunt.config.merge({
        pkg: require(global.cfg.CONFIG_LOCATION),
        webpack: {
            // teacher: teacher,
            // student: student,
            // parent: parent,
            vendor: vendor,
            // index: idx
        },
        'webpack-dev-server': {
            options: {
                keepAlive: true,
                contentBase: path.join(__dirname, '../')
            },
            teacher: {
                port: 8081,
                webpack: teacher
            },
            student: {
                port: 8086,
                webpack: student
            },
            parent: {
                port: 8083,
                webpack: parent
            },
            index: {
                port: 8084,
                webpack: idx
            },
            vendor: {
                port: 8085,
                webpack: vendor
            }
        }
    });
    grunt.registerTask('d', function (param) {
        var tasks;
        var devServerConfig = grunt.config.get('webpack-dev-server');
        switch (param) {
            case devParam.TEACHER:
                devServerConfig.teacher.webpack.output.filename = "bundle.js";
                devServerConfig.teacher.webpack.devtool = devtool;
                grunt.config.set('webpack-dev-server', devServerConfig);
                widthTest ? tasks = ['karma:teacher', 'webpack-dev-server:teacher'] : tasks = ['webpack-dev-server:teacher'];
                grunt.task.run(tasks);
                break;
            case devParam.STUDENT:
                devServerConfig.student.webpack.output.filename = "[name].bundle.js";
                devServerConfig.student.webpack.devtool = devtool;
                grunt.config.set('webpack-dev-server', devServerConfig);
                widthTest ? tasks = ['karma:student', 'webpack-dev-server:student'] : tasks = ['webpack-dev-server:student'];
                grunt.task.run(tasks);
                break;
            case devParam.PARENT:
                devServerConfig.parent.webpack.output.filename = "bundle.js";
                devServerConfig.parent.webpack.devtool = devtool;
                grunt.config.set('webpack-dev-server', devServerConfig);
                widthTest ? tasks = ['karma:parent', 'webpack-dev-server:parent'] : tasks = ['webpack-dev-server:parent'];
                grunt.task.run(tasks);
                break;
            case devParam.INDEX:
                devServerConfig.index.webpack.output.filename = "bundle.js";
                devServerConfig.index.webpack.devtool = devtool;
                grunt.config.set('webpack-dev-server', devServerConfig);
                widthTest ? tasks = ['karma:index', 'webpack-dev-server:index'] : tasks = ['webpack-dev-server:index'];
                grunt.task.run(tasks);
                break;
            case devParam.VENDOR:
                devServerConfig.vendor.webpack.output.filename = "[name]_bundle.js";
                devServerConfig.vendor.webpack.devtool = devtool;
                grunt.config.set('webpack-dev-server', devServerConfig);
                widthTest ? tasks = ['karma:index', 'webpack-dev-server:vendor'] : tasks = ['webpack-dev-server:vendor'];
                grunt.task.run(tasks);
                break;
            default:
                grunt.exit('请填写正确的参数:' + devParam.TEACHER + '|' + devParam.STUDENT + '|' + devParam.PARENT + '!');
                break;
        }
    });
    // vendor: ['angular', 'ionic','uuid','ngRedux']

    /*module.exports = {
     teacher: teacher,
     student: student,
     parent: parent,
     index: idx,
     }*/
};