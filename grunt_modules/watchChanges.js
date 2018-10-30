/**
 * Created by pengjianlun on 15-12-22.
 * 在开发模式中监听文件的改变实时生成末班和编译less
 */
module.exports = function (grunt) {

    grunt.config.merge({
        pkg: require(global.cfg.CONFIG_LOCATION),
        watch: {
            watchSources: {
                files: [
                    global.cfg.BASE_DIR + '<%=pkg.teacher%>/**/*.{html,less,js,css}',
                    global.cfg.BASE_DIR+'<%=pkg.student%>/**/*.{html,less,js,css}',
                    global.cfg.BASE_DIR+'<%=pkg.parent%>/**/*.{html,less,js,css}',
                    global.cfg.BASE_DIR+'<%=pkg.base%>/**/*.{html,less,js,css}',
                    '!' + global.cfg.BASE_DIR + '**/{templates.js,style.css}',
                ],
                tasks: ['compileLessAndTpls', 'copy:copySourceToRelease','replaceIpAddress']
            }
        }
    });
};