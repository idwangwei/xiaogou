/**
 * uploadZipFile.js
 */

module.exports = function(grunt) {
    var chalk  = require('chalk');

    grunt.registerTask("uploadZip", function() {

        if (!grunt.option("scp")) {
            console.log(chalk.green("Do NOT upload zip! Because of -scp=false"));
            return;
        }

        var FormData = require('form-data');
        var fs = require('fs');
        var path = require('path');
        var form = new FormData();
        var done = this.async();

        form.append('sys_type', global.cfg.sysType);
        form.append('sys_version', global.cfg.revCode);
        form.append('platform', grunt.getPlatformName());
        form.append('grade_num', global.cfg.gradeNum);
        form.append('tag', global.cfg.role.replace(/_/g, ''));
        form.append('author', global.cfg.author.replace(/_/g, ''));
        form.append('patch_file', fs.createReadStream(path.join(global.cfg.RELEASE_DIR, 'patch_' + global.cfg.buildName + '.zip')));
        if(global.cfg.isUploadInstaller) {
        form.append('install_file', fs.createReadStream(path.join(global.cfg.RELEASE_DIR, 'update_' + global.cfg.buildName + '.zip')));
        }
        form.append('version_ctrl_file', fs.createReadStream(path.join(global.cfg.RELEASE_DIR, "manifest.json")));

        grunt.chalk("Upload to: " + global.cfg.URL_UPLOAD_ZIP + 'update/upload');
        form.submit(global.cfg.URL_UPLOAD_ZIP + 'update/upload', function(err, res) {
            if(err) {
                grunt.exit('upload Failed', err);
            } else {
                console.log("upload Completed");
                res.resume();
            }

            done();
        });
    });

    /**
     * upload zip file manually
     */
    grunt.registerTask("upm", function() {
        var FormData = require('form-data');
        var fs = require('fs');
        var path = require('path');
        var form = new FormData();
        var done = this.async();

        form.append('sys_type', grunt.option("type"));
        form.append('sys_version', grunt.template.today("yyyymmddHHMM"));
        form.append('platform', grunt.option("pf"));
        form.append('grade_num', grunt.option("grade"));
        form.append('author', grunt.option("a"));
        form.append('install_file', fs.createReadStream(path.join("dist", grunt.option("i") + '.zip')));
        form.submit(getPatchUrl() + 'update/upload', function(err, res) {
            if(err) {
                grunt.exit('upload Failed', err);
            } else {
                console.log("upload Completed");
                res.resume();
            }

            done();
        });
    });

    function getPatchUrl() {
        var patchHost = '192.168.0.102';
        
        if(grunt.option('r')) {
            patchHost = "xuexiq.cn";
        }

        return "http://host:9080/".replace('host', patchHost);
    }
};