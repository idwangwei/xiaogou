import localforage from  "localforage";
import {LOG_LEVEL, UPLOAD_MAX_COUNT, LOG_SERVER, LOG_COUNT_LIMIT} from "./const";
import $ from "jquery";
import device from "./device";

let loggerDb = localforage.createInstance({name: "LOG_STORE"});
class LogMonitor {
    constructor() {
        this.uploadProcessing = false;
        this.enableUpload=false;
    }

    logMessage(logLevel, message) {
        let key = new Date().getTime();
        if (typeof message == "string") {
            message = {
                v: message
            }
        }
        switch (logLevel) {
            case LOG_LEVEL.DEBUG:
                message.l = "d";
                break;
            case LOG_LEVEL.WARN:
                message.l = "w";
                break;
            case LOG_LEVEL.ERROR:
                message.l = "e";
        }
        loggerDb.length().then(keyLen=> {
            if (keyLen < LOG_COUNT_LIMIT) {
                loggerDb.setItem(key.toString(), message);//如果这个操作失败了，我也没办法啦！
            }
            this.uploadLog(keyLen);
        });


    }

    uploadLog(keyLen, forceUpload) {
        if (!this.uploadProcessing&&this.enableUpload) {
            this.uploadProcessing = true;
            if (keyLen >= UPLOAD_MAX_COUNT || forceUpload) {
                loggerDb.keys().then(keys=> {
                    if (keys.length) {
                        this.uploadLogItems(keys).then(success=> {
                            this.uploadProcessing = false;
                            if (success)
                                this.deleteUploadedItems(keys);
                        });
                    } else { //如果在推到后台时将log上传成功了，在回到前台时，读取的值长度为零，此时将flag设置为false;
                        this.uploadProcessing = false;
                    }
                }).catch(error=> {
                    this.uploadProcessing = false;
                });
            } else {
                this.uploadProcessing = false;
            }
        }
    }

    uploadLogItems(keys) {
        let defer = $.Deferred();
        let uploadList = [];
        let count = 0;

        let uploadData = {
            device: device,//设备类型
            logs: uploadList,//日志信息
        };
        if (window.AppUtils) { //记录版本信息
            uploadData.app_version = window.AppUtils.getAppVersion();
            let changeLog = window.AppUtils.getChangeLog();
            let changelogs = [];
            changeLog.forEach(log=> {
                let changeLogItem = "";
                for (var key in log) {
                    if (key != "role") {
                        changeLogItem += log[key] + '|';
                    }
                }
                changelogs.push(changeLogItem);
            });
            uploadData.changeLog = changelogs;
        }

        function checkCanUpload() {
            if (count >= keys.length) {
                $.ajax({
                    url: LOG_SERVER,
                    data: {log: JSON.stringify(uploadData)},
                    type: "POST",
                    xhrFields: {
                        withCredentials: true
                    }
                })
                    .success(()=> {
                        defer.resolve(true);
                    })
                    .fail(()=> {
                        defer.resolve(false);
                    })

            }
        }

        keys.forEach(key=> {
            loggerDb.getItem(key).then(value=> {
                value.key = key;
                uploadList.push(value);
                count++;
                checkCanUpload.call(this);
            }).catch(err=> {
                console.log(err);
                count++;
                checkCanUpload.call(this);
            });
        });


        return defer;
    }

    deleteUploadedItems(keys) {
        keys.forEach(key=> {
            loggerDb.removeItem(key);
        });
    }

    saveUncaughtErrorMessage(message) {
        this.logMessage(LOG_LEVEL.ERROR, message);
    }
}

window.LogMonitor = new LogMonitor();
// window.onerror = function (message) {
//     window.LogMonitor.saveUncaughtErrorMessage(message);
//     return true;
// };
