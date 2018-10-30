/**
 * Created by pengjianlun on 15-12-21.
 * 编译各个端的less 和 angular templates
 */
module.exports = function (grunt) {
    var htmlminConfigObj = {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
    };
    var bootstrapConfig = function (module, script) {
        return 'define([ \'ionic\',\'./app\'], function(angular, app) { app.run([\'$templateCache\', function($templateCache) {' + script + '}]); });';
    };

    var lessConfig = {
        teacher: {}, student: {}, parent: {},qb:{}
    };
    lessConfig.parent[global.cfg.BASE_DIR + '<%=pkg.parent%>/' + 'less/style.css'] = global.cfg.BASE_DIR + '<%=pkg.parent%>/' + 'less/app.less';
    lessConfig.teacher[global.cfg.BASE_DIR + '<%=pkg.teacher%>/' + 'less/style.css'] = global.cfg.BASE_DIR + '<%=pkg.teacher%>/' + 'less/app.less';
    lessConfig.student[global.cfg.BASE_DIR + '<%=pkg.student%>/' + 'less/style.css'] = global.cfg.BASE_DIR + '<%=pkg.student%>/' + 'less/app.less';
    lessConfig.qb[global.cfg.BASE_DIR + '<%=pkg.qb%>/' + 'less/style.css'] = global.cfg.BASE_DIR + '<%=pkg.qb%>/' + 'less/app.less';

    grunt.config.merge({
        pkg: require(global.cfg.CONFIG_LOCATION),
        ngtemplates: {
            teacher: {
                cwd: global.cfg.BASE_DIR + '<%=pkg.teacher%>',
                src: ['partials/**/*.html', 'templates/**/*.html'],
                dest: global.cfg.BASE_DIR + '<%=pkg.teacher%>/' + 'scripts/templates.js',
                options: {
                    bootstrap: bootstrapConfig
                },
                htmlmin: htmlminConfigObj
            },
            student: {
                cwd: global.cfg.BASE_DIR + '<%=pkg.student%>',
                src: ['partials/**/*.html', 'templates/**/*.html'],
                dest: global.cfg.BASE_DIR + '<%=pkg.student%>/' + 'scripts/templates.js',
                options: {
                    bootstrap: bootstrapConfig
                },
                htmlmin: htmlminConfigObj
            },
            parent: {
                cwd: global.cfg.BASE_DIR + '<%=pkg.parent%>',
                src: ['partials/**/*.html', 'templates/**/*.html'],
                dest: global.cfg.BASE_DIR + '<%=pkg.parent%>/' + 'scripts/templates.js',
                options: {
                    bootstrap: bootstrapConfig
                },
                htmlmin: htmlminConfigObj
            },
            qb: {
                cwd: global.cfg.BASE_DIR + '<%=pkg.qb%>',
                src: ['partials/**/*.html', 'templates/**/*.html'],
                dest: global.cfg.BASE_DIR + '<%=pkg.qb%>/' + 'scripts/templates.js',
                options: {
                    bootstrap: bootstrapConfig
                },
                htmlmin: htmlminConfigObj
            }
        },
        less: {
            teacher: {
                files: lessConfig.teacher
            },
            student: {
                files: lessConfig.student
            },
            parent: {
                files: lessConfig.parent
            },
            qb:{
                files:lessConfig.qb
            }
        }
    });

    grunt.registerTask('compileLessAndTpls', ['ngtemplates:teacher', 'ngtemplates:student', 'ngtemplates:parent', 'less:teacher', 'less:student', 'less:parent']);

};
