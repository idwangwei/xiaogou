/**
 * Author 邓小龙 on 2016/1/15.
 * @description localstorageDb操作类
 */
import services from "./../index";
import _ from 'underscore/underscore';
'use strict';
services.service('localstorageDbUtil', ['$log', '$rootScope', 'commonService', 'finalData', 'dateUtil',
    function ($log, $rootScope, commonService, finalData, dateUtil) {
        var me = this;
        var USER_NAME;
        if ($rootScope.user && $rootScope.user.name && $rootScope.user.name != "") {
            USER_NAME = $rootScope.user.name + "老师，智算365欢迎您!";
        } else {
            USER_NAME = "您好，智算365欢迎您!";
        }

        this.save = function (dbName, data, key) {
            var db = commonService.getLocalStorage(dbName);
            if (!db || db.length == 0) {
                handleMsgInit(dbName);
            }
            if (!key) {
                $log.log("key is undefined!");
                return false;
            }
            var dbCopy = db.concat();
            if (typeof(data) == "string") {
                $log.log("string is not supported!");
                return false;
            }
            if (data instanceof  Array) {
                if (db.length == 0) {
                    db = data.concat();
                    commonService.setLocalStorage(dbName, db);
                    return true;
                }
                _.each(data, function (item) {
                    var index = -1;
                    _.each(dbCopy, function (record, i) {
                        if (record[key] == item[key]) {
                            index = i;
                            return true;
                        }

                    });
                    if (index >= 0) {
                        db.splice(index, 1, item);
                    } else {
                        db.push(item);
                    }
                });
                commonService.setLocalStorage(dbName, db);
                return true;
            }
            if (data instanceof Object) {
                if (db.length == 0) {
                    db.push(data);
                    commonService.setLocalStorage(dbName, db);
                    return true;
                }
                var index = -1;
                _.each(dbCopy, function (record, i) {
                    if (record[key] == data[key]) {
                        index = i;
                        return true;
                    }
                });
                if (index >= 0) {
                    db.splice(index, 1, data);
                } else {
                    db.push(data);
                }
                commonService.setLocalStorage(dbName, db);
                return true;
            }
            return false;
        };
        this.getAll = function (dbName) {
            var db = commonService.getLocalStorage(dbName);
            if (!db || db.length == 0) {
                handleMsgInit(dbName);
            }else {
                var existFlag=false;
                angular.forEach(db,function(sender){
                    if(sender.senderId=="1"&& $rootScope.user && sender.revId==$rootScope.user.userId) {
                        existFlag=true;
                    }
                });
                if(!existFlag){
                    handleMsgInit(dbName);
                }
            }
            return commonService.getLocalStorage(dbName);
        };

        var handleMsgInit = function (dbName) {
            if (dbName == finalData.DB_CONTACTS_T || dbName == finalData.DB_MSG_T) {
                var senderDb = [];
                var msgDb = [];
                var now = new Date();//当前时间
                var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATETIME_FORMAT;
                var nowDate = dateUtil.dateFormat.prototype.format(now, formatStr); //当前日期
                var MESSAGE = {
                    UNREAD: 0,
                    READ: 1
                };
                var msgType = {
                    msgType: '1'
                };
                var senderInfo = {
                    senderId: "1",
                    senderName: "智算365",
                    senderRole: "S",
                    revId:$rootScope.user&&$rootScope.user.userId   //TODO:临时这样处理可能会有bug
                };
                var msgInfo = {
                    msgId: "1",
                    senderId: "1",
                    otherData: JSON.stringify(msgType),
                    msgContent: USER_NAME,
                    msgDateTime: nowDate,
                    magStatus: MESSAGE.UNREAD
                };
                senderDb.push(senderInfo);
                msgDb.push(msgInfo);
                $log.log(msgDb);
                commonService.setLocalStorage(finalData.DB_CONTACTS_T, senderDb);
                commonService.setLocalStorage(finalData.DB_MSG_T, msgDb);
            }
        }

    }]);



