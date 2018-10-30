/**
 * Created by pengjianlun on 15-12-21.
 * 读取buildCfg中的不同的配置，将不同端的代码（教师,学生，家长）copy到/release
 */
module.exports = function (grunt) {
    var DEBUG_OPTION = 'sourceDebug';
    var path = require('path');
    var fileList = [{
        expand: true,
        flatten: false,
        cwd: global.cfg.BASE_DIR + '/<%=pkg.teacher%>',
        src: ['teacher_index.html'],
        dest: path.join(global.cfg.RELEASE_DIR, 'build')
    }, {
        expand: true,
        flatten: false,
        cwd: global.cfg.BASE_DIR + '/<%=pkg.student%>',
        src: ['student_index.html'],
        dest: path.join(global.cfg.RELEASE_DIR, 'build')

    }, {
        expand: true,
        flatten: false,
        cwd: global.cfg.BASE_DIR + '/<%=pkg.parent%>',
        src: ['parent_index.html'],
        dest: path.join(global.cfg.RELEASE_DIR, 'build')

    }, {
        expand: true,
        flatten: true,
        cwd: global.cfg.BASE_DIR,
        src: ['<%=pkg.student_base%>/index.html', '<%=pkg.student_base%>/commonWidgets/**/*.*'],
        dest: path.join(global.cfg.RELEASE_DIR, 'build')

    }, {
        expand: true,
        flatten: true,
        cwd: global.cfg.BASE_DIR,
        src: ['<%=pkg.student_base%>/tempIndex/index.html'],
        dest: global.cfg.RELEASE_DIR

    }, {
        expand: true,
        flatten: false,
        cwd: path.join(global.cfg.BASE_DIR,"src/common"),
        src: ['handleError.js'],
        dest: path.join(global.cfg.RELEASE_DIR,"build")
    }];
    //源代码文件目录
    var sourceFileList = [
        {
            expand: true,
            flatten: false,
            cwd: global.cfg.BASE_DIR,
            src: ['<%=pkg.teacher%>/**/*.*'],
            dest: path.join(global.cfg.RELEASE_DIR)
        }, {
            expand: true,
            flatten: false,
            cwd: global.cfg.BASE_DIR,
            src: ['<%=pkg.student%>/**/*.*'],
            dest: path.join(global.cfg.RELEASE_DIR)
        }, {
            expand: true,
            flatten: false,
            cwd: global.cfg.BASE_DIR,
            src: ['<%=pkg.parent%>/**/*.*'],
            dest: path.join(global.cfg.RELEASE_DIR)
        }
    ];
    if (grunt.option(DEBUG_OPTION) == true) {
        fileList = fileList.concat(sourceFileList);
    }
    grunt.config.merge({
        pkg: require(global.cfg.CONFIG_LOCATION),
        libdirs: grunt.file.readJSON('buildCfg/bower_components.json'),
        clean: {
            options: {
                force: true
            },
            cleanRelease: {
                files: [{src: [global.cfg.RELEASE_DIR + '/**/**']}]
            }
        },
        copy: {
            copySourceToRelease: {
                files: fileList
            },
            copyMathJaxToRelease: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        cwd: path.join(__dirname, '../bower_components'),
                        src: ['MathJax/MathJax.js', 'MathJax/config/**/*', 'MathJax/jax/**/*'],
                        dest: path.join(global.cfg.RELEASE_DIR, 'build')
                    }
                ]
            },
            copyLibToRelease:{
                files:[
                    {
                        expand: true,
                        flatten: false,
                        cwd: path.join(__dirname, '../bower_components'),
                        src: ['jquery/dist/jquery.js'],
                        dest: path.join(global.cfg.RELEASE_DIR, 'build')
                    },{
                        expand: true,
                        flatten: false,
                        cwd: path.join(__dirname, '../bower_components'),
                        src: ['ionic/release/css/ionic.css','ionic/release/fonts/**.*'],
                        dest: path.join(global.cfg.RELEASE_DIR, 'build')
                    }
                ]
            }
        }
    });

    grunt.registerTask('genReleaseByCfg', ['clean:cleanRelease', 'copy:copySourceToRelease', 'copy:copyMathJaxToRelease','copy:copyLibToRelease'])
};

