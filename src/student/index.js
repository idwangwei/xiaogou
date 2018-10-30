(function () {

    var CST = {};
    var CHECK_COMPLETION_EVENT = 'checkCompletionEvt';
    document.addEventListener("deviceready", onDeviceReady, false);

    function initVariables() {
        window.manifestData = {};
        window.manifestDataOld = {};
        window.filesDelete = [];
        window.filesAdd = [];
        window.filesSame = [];
        window.totalAdd = 0;
        window.totalDelete = 0;
        window.isLoading = true;
    }
    function initConstants() {
        CST.URL_REMOTE = '192.168.0.49:8080/';
        CST.DIR_REMOTE = 'update' + getDirLocal(); //CONST.UPDATE_DIR;
        CST.DIR_LOCAL = 'eclass_for_student' + getDirLocal();
        CST.MANIFEST_FILE_NAME = 'manifest.json';
        //CST.MANIFEST_LOCAL_DIR = cordova.file.externalRootDirectory;
        CST.MANIFEST_LOCAL_DIR = CST.DIR_LOCAL;
//        CST.MANIFEST_LOCAL_DIR = cordova.file.externalRootDirectory + CST.DIR_LOCAL;
        CST.MANIFEST_LOCAL = cordova.file.dataDirectory + CST.MANIFEST_LOCAL_DIR + CST.MANIFEST_FILE_NAME;
        CST.MANIFEST_REMOTE = CST.URL_REMOTE + CST.DIR_REMOTE + CST.MANIFEST_FILE_NAME;
    }

    function getDirLocal() {
        var dirLocal = window.localStorage.getItem('dirLocal');
        if(window.isNaN(String(dirLocal)) || dirLocal == '1') dirLocal = ''; // '' for grade 1
        return dirLocal + '/';
    }

    function registerHandlers() {
        $("#check").on("click", checkVersion);
        $("#btnLoad").on("click", load);
        $("#reset").on('click', resetResources);
        $("#run").on('click', runGame);
        $('#progressModal').on('hide.bs.modal', handleHideModal);
        $(document).on(CHECK_COMPLETION_EVENT, checkCompletion);
    }

    function handleRemoteIp() {
        $("#remoteIP").val(CST.URL_REMOTE);

        //init constants again!
        initConstants();
    }

    function getRandomInt(end, start){
        return (Math.random()*(end - (start||0)) + (start||0))|0;
    }

    var MSG_COUNT = 8;
    var messages = [];
    function logger(msg, status) {

        $('#progressModal').modal('show');
        $('#myContainer').show();

        /*messages.push(msg);
         while (messages.length > MSG_COUNT) {messages.shift();}*/
        //document.getElementById("statusPlace").innerHTML = messages.join('<br/>');
        var _tr = $("#statusPlace>tbody>tr"),
            len = _tr.length,
            first = _tr.first(),
            clone = first.clone();
        clone.find('td').first().html(status || '-');
        clone.find('td').last().html(msg);
        clone.insertAfter(first);

        if (len > MSG_COUNT) {_tr.last().remove();}
        //scrollTo(0,document.body.scrollHeight);
    }

    function checkVersion() {
        initVariables(); // init variables
        initConstants(); //init constants again!

        var times = 0,
            ALL_DONE = 2;

        function _done(data) {
            //logger('manifest.json success!', 'success');
            manifestData = data;
            times++;
            checkDiff();
        }

        function _done2(data) {
            //logger('old manifest.json success!', 'success');
            manifestDataOld = data;
            times++;
            window.manifestDataOldFiles = Object.keys( manifestDataOld.files);
            $(document).trigger(CHECK_COMPLETION_EVENT, {m:manifestDataOld, c:checkDiff});
        }

        function _fail(data) {
            var randSec = getRandomInt(10, 5);
            logger('manifest.json fail!', 'fail');
            logger('重试中... ' + randSec + 's');
            setTimeout(checkResources, randSec*1000);
        }

        function _fail2(data) {
            logger('old manifest.json dose not exsit!', 'fail');
            manifestDataOld.files = {};
            times++;
            checkDiff();
        }

        function checkDiff() {
            if (times !== ALL_DONE) return;

            console.time("checkDiff");
            _.each(manifestData.files, function(v, k){
                var v2 = _.find(manifestDataOld.files, function(v2, k2){
                    return k === k2; // version === version
                });
                if (v2 === undefined) { //Manifest中的 k, 在OldManifest中未找到  标记为 待添加！
                    filesAdd.push(k);
                } else if (v === v2) { //匹配成功, 版本号相同
                    filesSame.push(k);
                    delete manifestDataOld.files[k];
                } else { //匹配成功, 版本号不同。 先删除，再添加
                    filesDelete.push(k);
                    filesAdd.push(k);
                    delete manifestDataOld.files[k];
                }
            });
            // OldManifest 剩余的files, 则认为是多余的
            _.each(manifestDataOld.files, function(v, k){
                filesDelete.push(k);
            });
            console.timeEnd("checkDiff");

            /** 记录总数 */
            totalAdd = filesAdd.length;
            totalDelete = filesDelete.length;

            if(totalAdd || totalDelete) {
                logger('版本检查成功!', 'success');
                logger(totalDelete + ' 个文件需要删除.');
                logger(totalAdd + ' 个文件需要下载.');

                if(totalAdd + totalDelete < 50) {
                    _.each(filesDelete, function (v) {
                        logger(v);
                    });
                    logger('------------');
                    _.each(filesAdd, function (v) {
                        logger(v);
                    });
                }

                logger('3 秒后自动处理...');
                setTimeout(function () {
                    load();
                }, 3000);

            } else {
                runGame();
            }
        }

        XHR(CST.MANIFEST_REMOTE, _done, _fail)
            .then(function(){
                XHR(CST.MANIFEST_LOCAL, _done2, _fail2);
            });
    }

    /**
     * 检查资源完整性
     * @param evt
     * @param data
     */
    function checkCompletion(evt, data) {
        var manifestDataOld = data.m;
        var checkDiffFn = data.c;
        var App = new DownloadApp();
        var fileURL = manifestDataOldFiles.pop();
        if (fileURL) {
            App.isFileExist(CST.DIR_LOCAL + fileURL, function () {
                $(document).trigger(CHECK_COMPLETION_EVENT, data);
            }, function () {
                delete manifestDataOld.files[fileURL];
                $(document).trigger(CHECK_COMPLETION_EVENT, data);
            });
        } else {
            typeof checkDiffFn === 'function' && checkDiffFn.call(window);
        }
    }

    function load() {
        var filesAdd = window.filesAdd,
            filesDelete = window.filesDelete;
        window.isLoading = true;

        if (!!filesDelete.length) {
            deleteFiles(filesDelete[0], CST.MANIFEST_LOCAL_DIR);
        } else {
            if (!!filesAdd.length) {
                download(filesAdd[0], CST.MANIFEST_LOCAL_DIR);
            } else {
                logger(totalAdd + 'files success!', 'success');
                download(CST.MANIFEST_FILE_NAME, CST.MANIFEST_LOCAL_DIR)
            }
        }
    }

    /**
     * 下载文件
     * @param file
     * @param dir
     */
    function download(file, dir) {
        var that = this,
            files = file.split("/"),
            App = new DownloadApp(),
            fileName = files.pop(),
            uri = encodeURI( CST.URL_REMOTE + CST.DIR_REMOTE + file),
            folderName = (dir || '')+files.join('/');

        App.load(uri, folderName, fileName,
            /*progress*/function (percentage) {
                //console.log(percentage, "%");
            },
            /*success*/function (entry) {
                if(filesAdd.length) {
                    filesAdd.shift();
                    updateProgressBar();
                    logger('load ' + entry.toURL() + '&nbsp; ' + (totalAdd - filesAdd.length) + '/' + totalAdd, 'success');
                    if(isLoading) { //如果模态框显示
                        $("#btnLoad").trigger("click"); //继续加载下一个文件
                    }
                } else {
                    logger(entry.name + ' updated! <hr>');

                    logger("文件更新完毕，3秒后自动进入游戏...");
                    setTimeout(function(){
                        runGame();
                    }, 3000);
                }
            },
            /*fail*/function () {
                var randSec = getRandomInt(10, 5);
                logger('load ' + fileName, 'fail');
                logger('重试中... ' + randSec + 's');
                setTimeout(function(){
                    $("#btnLoad").trigger('click');
                }, randSec*1000);
            }
        );
    }

    /**
     * 删除文件
     */
    function deleteFiles(file, dir) {
        var that = this,
            files = file.split("/"),
            App = new DownloadApp(),
            fileName = files.pop(),
            folderName = (dir || '')+files.join('/');

        folderName += folderName.match(/\/$/) ? '': '/';
        App.del(folderName, fileName, function(){
            filesDelete.shift();
            logger('success delete ' + fileName + '&nbsp; ' + (totalDelete - filesDelete.length) + '/' + totalDelete, 'success');
            $("#btnLoad").trigger("click");
        }, function(){
            filesDelete.shift();
            logger('fail delete ' + fileName, 'fail, skipped!');
            $("#btnLoad").trigger("click");
        });
    }

    /**
     * 更新进度条
     */
    function updateProgressBar() {
        var progress = (((totalAdd - filesAdd.length) / totalAdd) * 100).toFixed(1) + '%';
        $(".progress>div").css('width', progress).html(progress);
    }

    /**
     * 重置游戏资源
     */
    function resetResources(){
        if(!confirm('确定要重置资源吗？')) return;

        new DownloadApp().delDir(CST.MANIFEST_LOCAL_DIR, '', function(){
            logger('Reset success!', 'success');
        }, function(){
            logger('Reset fail!', 'fail');
        }, true);
    }

    /**
     * 模态框隐藏后处理事件
     * @param e
     */
    function handleHideModal(){
        //window.isLoading = false; // 模态框隐藏，中断下载
    }

    /**
     * 启动游戏
     */
    function runGame() {
        initConstants();
        window.location.href = cordova.file.dataDirectory + CST.MANIFEST_LOCAL_DIR /*+ 'files/'*/ + 'index.html';
    }

    /**
     * 检查资源
     */
    function checkResources() {
        checkVersion();
    }

    function onDeviceReady() {
        // navigator.splashscreen.hide();
        //logger('准备检查版本...');
        //initConstants();
        //handleRemoteIp();
        registerHandlers();
        //检查最新版本
        checkResources();
    }
}());
