/**
 * Author 邓小龙 on 2016/1/11.
 * @description indexDb操作类
 */
import services from "./../index";
'use strict';
services.factory('indexedDbUtil', ['$log',
    function ($log) {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        var STORE_NAME = {
            CONTACTS: "contactsT",
            MESSAGE: "messageT"
        };

        function Db(objectStoreName, version) {
            if (!objectStoreName) {
                $log.log("objectStoreName is undefined");
                return;
            }
            if (!version) {
                $log.log("version is undefined");
                return;
            }
            var me = this;
            this.version = version;
            this.objectStoreName = objectStoreName;
            this.instance = {};
            this.upgrade = function (e) {
                try {
                    var
                        _db = e.target.result,
                        names = _db.objectStoreNames,
                        name = me.objectStoreName;
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
                        }
                    }
                } catch (e) {
                    $log.log(e);
                }
            };
            this.errorHandler = function (error) {
                $log.error('dbError: ' + error.target.error.message);
            };
            this.open = function (callback) {
                try {
                    var request = window.indexedDB.open(
                        me.objectStoreName, me.version);
                    request.onerror = me.errorHandler;
                    request.onupgradeneeded = me.upgrade;
                    request.onsuccess = function (e) {
                        me.instance = request.result;
                        me.instance.onerror = me.errorHandler;
                        callback();
                    };
                } catch (e) {
                    $log.log(e);
                }

            };
            this.deleteDb = function (callback) {
                var request = window.indexedDB.deleteDatabase(
                    me.objectStoreName);
                request.onsuccess = function (e) {
                    callback();
                };
            };
            this.getObjectStore = function (mode) {
                try {
                    var txn, store;
                    mode = mode || 'readonly';
                    txn = me.instance.transaction(
                        [me.objectStoreName], mode);
                    store = txn.objectStore(
                        me.objectStoreName);
                    return store;
                } catch (e) {
                    $log.log(e);
                }

            };
            this.save = function (data, flag, callback) {
                try {
                    var store, request,
                        mode = 'readwrite';
                    store = me.getObjectStore(mode),
                        request = flag == true ? store.put(data) : store.add(data);
                    request.onsuccess = callback;
                } catch (e) {
                    $log.log(e);
                }

            };
            this.getAll = function (callback) {
                try {
                    var
                        store = me.getObjectStore(),
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
                } catch (e) {
                    $log.log(e);
                }
            };
            this.get = function (id, callback) {
                try {
                    var
                        store = me.getObjectStore(),
                        request = store.get(id);
                    request.onsuccess = function (e) {
                        callback(e.target.result);
                    };
                } catch (e) {
                    $log.log(e);
                }
            };

            function createStore(_db, storeName, keyName, idIncreFlag, indexs) {
                try {
                    var objectStore = _db.createObjectStore(storeName, {
                        keyPath: keyName,
                        autoIncrement: idIncreFlag
                    });
                    _.each(indexs, function (indexInfo) {
                        objectStore.createIndex(indexInfo.indexName, indexInfo.keyName, indexInfo.uniqueSet);
                    });
                } catch (e) {
                    $log.log(e);
                }
            }
        }

        return {
            Db: Db
        }

    }]);

