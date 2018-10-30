/**
 * Author 邓小龙 on 2016/1/11.
 * @description indexDb操作类
 */
define(['./../index'], function (services) {
    'use strict';
    services.service('indexedDbUtil', ['$log',
        function ($log) {
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

            var STORE_NAME = {
                CONTACTS: "contacts",
                MESSAGE: "message"
            };

            var me=this;

            var db = {
                version: null,
                objectStoreName: null,
                instance: {},
                upgrade: function (e) {
                    var
                        _db = e.target.result,
                        names = _db.objectStoreNames,
                        name = db.objectStoreName;
                    if (!names.contains(name)) {
                        switch (name) {
                            case STORE_NAME.CONTACTS:
                                var indexs = [
                                    {indexName: "senderId", keyName: 'senderId', uniqueSet: {unique: true}},
                                    {indexName: "senderName", keyName: 'senderName', uniqueSet: {unique: false}},
                                    {indexName: "senderRole", keyName: 'senderRole', uniqueSet: {unique: false}}
                                ];
                                createStore(_db, STORE_NAME.CONTACTS, "senderId", false, indexs);
                                break;
                            case STORE_NAME.MESSAGE:
                                var indexs = [
                                    {indexName: "senderId", keyName: 'senderId', uniqueSet: {unique: false}},
                                    {indexName: "otherData", keyName: 'otherData', uniqueSet: {unique: false}},
                                    {indexName: "msgTitle", keyName: 'msgTitle', uniqueSet: {unique: false}},
                                    {indexName: "msgContent", keyName: 'msgContent', uniqueSet: {unique: false}},
                                    {indexName: "msgDateTime", keyName: 'msgDateTime', uniqueSet: {unique: false}},
                                    {indexName: "magStatus", keyName: 'magStatus', uniqueSet: {unique: false}}
                                ];
                                createStore(_db, STORE_NAME.MESSAGE, "msgId", false, indexs);
                                break;
                        }{}
                    }
                },
                errorHandler: function (error) {
                    $log.error('dbError: ' + error.target.error.message);
                },
                open: function (callback) {
                    var request = window.indexedDB.open(
                        db.objectStoreName, db.version);
                    request.onerror = db.errorHandler;
                    request.onupgradeneeded = db.upgrade;
                    request.onsuccess = function (e) {
                        db.instance = request.result;
                        db.instance.onerror = db.errorHandler;
                        callback();
                    };
                },
                getObjectStore: function (mode) {
                    var txn, store;
                    mode = mode || 'readonly';
                    txn = db.instance.transaction(
                        [db.objectStoreName], mode);
                    store = txn.objectStore(
                        db.objectStoreName);
                    return store;
                },
                save: function (data, callback) {
                    db.open(function () {
                        var store, request,
                            mode = 'readwrite';
                        store = db.getObjectStore(mode),
                            request =  store.add(data);
                        request.onsuccess = callback;
                    });
                },
                getAll: function (callback) {
                    db.open(function () {
                        var
                            store = db.getObjectStore(),
                            cursor = store.openCursor(),
                            data = [];
                        cursor.onsuccess = function (e) {
                            var result = e.target.result;
                            if (result &&
                                result !== null) {
                                data.push(result.value);
                                result.continue();
                            } else {
                                callback(data);
                            }
                        };
                    });
                },
                get: function (id, callback) {
                    id = parseInt(id);
                    db.open(function () {
                        var
                            store = db.getObjectStore(),
                            request = store.get(id);
                        request.onsuccess = function (e) {
                            callback(e.target.result);
                        };
                    });
                },

                'delete': function (id, callback) {
                    id = parseInt(id);
                    db.open(function () {
                        var
                            mode = 'readwrite',
                            store, request;
                        store = db.getObjectStore(mode);
                        request = store.delete(id);
                        request.onsuccess = callback;
                    });
                },

                deleteAll: function (callback) {
                    db.open(function () {
                        var mode, store, request;
                        mode = 'readwrite';
                        store = db.getObjectStore(mode);
                        request = store.clear();
                        request.onsuccess = callback;
                    });

                }

            };
            function createStore(_db,storeName,keyName,idIncreFlag,indexs){
                var objectStore = _db.createObjectStore(storeName, {
                    keyPath: keyName,
                    autoIncrement: idIncreFlag
                });
                _.each(indexs,function(indexInfo){
                    objectStore.createIndex(indexInfo.indexName, indexInfo.keyName,indexInfo.uniqueSet);
                });
            }


            /**
             * 获取目标数据库
             * @param dbName
             * @param dbVersion
             */
            this.getDbInstance=function(dbName,dbVersion){
                if(!dbName){
                    $log.log("dbName is undefined");
                    return ;
                }
                if(!dbVersion){
                    $log.log("dbVersion is undefined");
                    return ;
                }
                if(db.instance.IDBDatabase){
                    if(db.instance.IDBDatabase.name==dbName&&db.instance.IDBDatabase.version==dbVersion){
                        return db;
                    }
                }
                db.objectStoreName=dbName;
                db.version=dbVersion;
                db.open(function(){
                    $log.log("open db success！");
                });
                var dbCopy=angular.copy(db);
                return db;
            }
        }]);
});
