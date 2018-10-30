/**
 * beforeBuild.js
 * LuoWen 20151211
 */

module.exports = function (grunt) {

    grunt.registerTask("beforeBuild", function () {
        parseGruntOption(grunt);
        grunt.task.run(['svnlog:allere_eclass']);
    });

    function parseGruntOption(grunt) {
        // body...
        if (process.argv.indexOf(global.cfg.AUTO_UPDATE_COMMAND_NAME) != -1) {
            getPatchUrl();

            global.cfg.gradeNum = "0";
            global.cfg.dateTemplate = grunt.template.today("yyyymmddHHMM");
            global.cfg.isIOS = !!grunt.option("ios");
            global.cfg.isWin = !!grunt.option("win");
            global.cfg.comment = grunt.option("comment");
            global.cfg.author = getAuthor(grunt);
            global.cfg.platform = getPlatform(grunt);
            global.cfg.role = getRoleType(grunt);
            global.cfg.port = getIPPort(grunt);
            global.cfg.buildName = parseBuildName(grunt);
            global.cfg.revCode = global.cfg.dateTemplate; //以时间戳作为版本增长的记号
            //global.cfg.revision = getSvnRevision(grunt);
            global.cfg.sysType = getSysType(grunt); //本次上传是否提交到SVN
            global.cfg.forceInstaller = grunt.option("forcei");
        }
        global.cfg.config = getConfig(grunt);
    }

    function getConfig(grunt) {
        var config = grunt.option('config');
        if (config) {
            var configLocation = 'buildCfg/' + config;
            if (grunt.file.exists(configLocation)) {
                global.cfg.CONFIG_LOCATION = configLocation;
            } else {
                var chalk = require("chalk");
                console.log(chalk.underline.green("file:'" + configLocation + "' is not found! use default location:" + global.cfg.CONFIG_LOCATION));
            }
        }
    }


    function getAuthor(grunt) {
        // body...
        var author = grunt.option("author");
        if (!author) grunt.exit("请输入打包者的名字  -author=(pjl|hhc|dxl)  ");
        return author;
    }

    function getRoleType(grunt) {
        // body...
        var role = grunt.option("role");

        // if (role === "s") role = "student";
        // else if (role === "t") role = "teacher";
        // else if (role === "p") role = "parent";
        if (!role || !role.match(/[a-zA-z,]+/)) {
            grunt.exit("请输入正确的角色  -role=p,s,t     <学生，老师，家长>");
        }

        return role.replace(/,/g, "")
            .toLowerCase()
            .trim()
            .split(/|/)
            .sort()
            .join('');
    }

    function getIPPort(grunt) {
        var port = grunt.option("p") + "";

        if (!(port && port.match(/\d{2,5}/))) {
            grunt.exit("请输入正确端口号  -p=(8080|9060)");
        }

        return "p" + port;
    }

    function getPlatform(grunt) {
        // body...
        var platform;

        if (global.cfg.isIOS) platform = "ios_";
        else if (global.cfg.isWin)platform = "win_";
        else platform = "";//android

        return platform;
    }

    function parseBuildName() {
        var buildName = "{{platform}}eclass_for{{role}}{{revision}}{{port}}{{dateTemplate}}{{author}}{{comment}}";

        var buildProps = {
            dateTemplate: global.cfg.dateTemplate,
            platform: global.cfg.platform,
            role: global.cfg.role,
            comment: global.cfg.comment,
            port: global.cfg.port,
            author: global.cfg.author
        };

        //parse build props
        for (var p in buildProps) {
            if (buildProps[p]) {
                buildName = buildName.replace(new RegExp("{{" + p + "}}"), "_" + buildProps[p]);
            }
        }

        //clean redundant props
        for (var p in buildProps) {
            buildName = buildName.replace(/{{.*?}}/g, "");
        }

        return buildName;
    }


    function getPatchUrl() {
        var patchHost = '192.168.0.161';
        var urlGetZipStr = "http://host:9060/";
        // var patchHost = '192.168.0.165';

        if (grunt.option('remote')) {
            patchHost = "www.xuexix.com";
            urlGetZipStr = "http://host/update/";

        } else if (grunt.option('ip') == "165") {
            //patchHost = '192.168.0.165';
            //IP 165 特殊处理
            global.cfg.URL_GET_ZIP = "http://192.168.0.165/update/";
            global.cfg.URL_UPLOAD_ZIP = "http://192.168.0.165:9080/";
            return;
        } else if (grunt.option('ip') == "102") {
            patchHost = '192.168.0.102';
        } else if (grunt.option('ip') == "103") {
            patchHost = '192.168.0.103';
        } else if (grunt.option('ip') == "161") {
            patchHost = '192.168.0.161';
        } else if (grunt.option('ip') == 'test_remote') {
            patchHost = 'www.alrtest.com';
            urlGetZipStr = "http://host/update/";
        } else if(grunt.option('ip')=='test_xuexihappy'){
            patchHost = 'www.xuexihappy.com';
            urlGetZipStr = "http://host/update/";
        }

        global.cfg.URL_GET_ZIP =urlGetZipStr.replace('host', patchHost);
        global.cfg.URL_UPLOAD_ZIP = "http://host:9080/".replace('host', patchHost);
    }

    function getSysType(grunt) {
        var sysType = "AS20151231-LU"; //Default SystemType
        var isTempTest = grunt.option('test');

        if (!isTempTest && isTempTest !== false) {
            grunt.exit("本次上传是否临时测试？请添加 -test=<boolean>");
        } else if (isTempTest) {
            sysType = "TEMP_UPLOAD";
        }

        grunt.chalk("SysType: " + sysType);
        return sysType;
    }
};