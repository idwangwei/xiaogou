/**
 * makePatchVersionManifest
 *
 * @author LuoWen
 * @date 2016/1/7
 */

'use strict';
module.exports = function(grunt) {
    var path = require('path'),
        fs = require('fs'),
        url = require("url"),
        chalk  = require('chalk');

    var serverVersionManifest,
        localNewVersionManifest;

    grunt.registerTask("makePatchVersionManifest", function() {

        getServerVersionManifest.call(this, this.async());
        getLocalVersionManifest.call(this);

        grunt.task.run('compareVersionManifest');
    });

    grunt.registerTask("compareVersionManifest", function(){
        compareVersionManifest();
        //grunt.task.run('compressZipPatch');
        makePatchManifest();
    });

    function getServerVersionManifest(done) {
        getServerVersionManifestURL(done);
    }

    /**
     * 获取远程的版本文件的URL
     * @return {[type]} [description]
     */
    function getServerVersionManifestURL(done) {
        grunt.chalk("getServerVersionManifestURL...");
        var param = {
            sysType : global.cfg.sysType,
            platform: grunt.getPlatformName(),
            gradeNum: global.cfg.gradeNum,
            version: getCustomizedServerVersion()
        };
        var _host = global.cfg.URL_UPLOAD_ZIP;
        var _url = 'update/getLatestManifest'+grunt.getUrlRemoteParams(param);
        grunt.chalk(_host + _url);

        getServerVersionManifestCommon(done, _host + _url, success);

        function success(done, retStr) {
            var fileData = JSON.parse(retStr);
            if(!(fileData && fileData.updates)) grunt.exit("解析远程版本文件URL出错");
            //是否需要上传安装包
            global.cfg.isUploadInstaller = (fileData.isUploadInstaller === 'undefined')
                ? true
                : !!fileData.isUploadInstaller;

            if(global.cfg.forceInstaller) {
                global.cfg.isUploadInstaller = true;
            }

            grunt.chalk("isUploadInstaller: " + global.cfg.isUploadInstaller)

//TODO version
            /*var urlObj = url.parse(_url);
             urlObj.port = "90"*/
            var _updateHost = global.cfg.URL_GET_ZIP;
            var _updateUrl = fileData.updates[0] && fileData.updates[0].url;
            var isRemoteManifestExist = !!_updateUrl;
            getServerVersionManifestContent(done, _updateHost + _updateUrl, isRemoteManifestExist);
        }
    }

    /**
     * 获取远程的版本文件
     * @return {[type]} [description]
     */
    function getServerVersionManifestContent(done, manifestURL, isRemoteManifestExist) {
        if(!isRemoteManifestExist) {
            console.log(chalk.cyan("remote manifest dose NOT EXIST..."));
            serverVersionManifest = {files:{}};
            done();
            return;
        }

        console.log(chalk.cyan("getServerVersionManifestContent..."));
        getServerVersionManifestCommon(done, manifestURL, success);

        function success(done, retStr) {
            var fileData = JSON.parse(retStr);
            if(!(fileData && fileData.files)) grunt.exit("远程版本文件出错");
            serverVersionManifest = fileData;
            done();
        }
    }

    function getServerVersionManifestCommon(done, uri, success) {
        var http = require("http");
        var options = url.parse(uri);

        http.request(options, function(res) {
            var retStr = "";
            res.on('data', function(chunk) {
                retStr += chunk;
            }).on('end', function(){
                typeof success === 'function' && success(done, retStr);
            });
        }).end();
    }

    /**
     * 获取本地的版本文件
     * @return {[type]} [description]
     */
    function getLocalVersionManifest() {
        var READ_JSON_FILE = path.join("./", global.cfg.RELEASE_DIR, "manifest.json");
        localNewVersionManifest = getFileData(READ_JSON_FILE);
    }

    /**
     * 比较两个版本文件
     *
     * 引用自动更新部分逻辑
     * @return {[type]} [description]
     */
    function compareVersionManifest() {
        var _ = require("underscore");

        var filesDelete = [];
        var filesAdd = [];
        var filesSame = [];
        _.each(localNewVersionManifest.files, function(v, k) {
            var v2 = _.find(serverVersionManifest.files, function(v2, k2) {
                return k === k2; // version === version
            });
            if (v2 === undefined) { //Manifest中的 k, 在OldManifest中未找到  标记为 待添加！
                filesAdd.push(k);
            } else if (v === v2) { //匹配成功, 版本号相同
                filesSame.push(k);
                delete serverVersionManifest.files[k];
            } else { //匹配成功, 版本号不同。 先删除，再添加
                //filesDelete.push(k);  //如果使用zip解压覆盖，就不需要先删除再添加 // LuoWen on 20160108
                filesAdd.push(k);
                delete serverVersionManifest.files[k];
            }
        });
        // OldManifest 剩余的files, 则认为是多余的
        _.each(serverVersionManifest.files, function(v, k) {
            filesDelete.push(k);
        });


        global.patch = {
            filesDelete: filesDelete,
            filesAdd: filesAdd,
            filesSame: filesSame
        };
    }

    // 获取文件中的file
    function getFileData(jsonFile) {
        var fileData = JSON.parse(fs.readFileSync(jsonFile));
        if(!(fileData && fileData.files)) grunt.exit("本地版本文件出错");
        return fileData;
    }

    /**
     * 生成补丁版本文件 manifestDel.json
     */
    function makePatchManifest() {
        var manifestDel = {
            files: {}
        };

        global.patch.filesDelete.forEach(function(file){
            manifestDel.files[file] = "";
        });

        grunt.log.ok('Generate manifestDel.json');
        grunt.file.write(path.join(global.cfg.RELEASE_DIR, "manifestDel.json"), JSON.stringify(manifestDel));
    }

    function getCustomizedServerVersion() {
        var version = grunt.option('ver') || "";

        if (version) {
            grunt.chalk("Use Customized Server Version, Do NOT upload!");
            grunt.option("scp", "");
            global.cfg.scp = false;
        }

        return version;
    }

};