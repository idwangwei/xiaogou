/**
 * @author 彭建伦 on 2015/8/31.
 */
define(['./index'], function (services) {
    services.service('homeService',
        ['$log','$q', 'commonService', 'serverInterface', 'jPushManager', 'profileService','$rootScope'
            , function ($log,$q, commonService, serverInterface, jPushManager, profileService,$rootScope) {

            var me = this;
            var CONNECT_INFO = {
                SOCKET_CONNECT_TRY_TIME: 3,//socket尝试连接的次数
                LABEL_FOR_PUBLISH_WORK: 1,//发布作业
                LABEL_FOR_RECYCLE_WORK: 2,//回收作业
                LABEL_FOR_SEND_PRAISE: 3//接收表扬信息
            };

            this.category = 1;//[1,2] ,1为课堂，2为家庭
            this.data = {};
            this.data.loadCount=0;
            this.data.connectStatus = false;//是否已经连接上websocket或者jpush
            this.data.availableGames = [];
            this.data.availableWorks = [];
            this.data.messageQueue = [];

            var socketConnectCounter = 0;
            var thiz = this;

            ///**
            // * 连接websocket,尝试次数为CONNECT_INFO.SOCKET_CONNECT_TRY_TIME,如果全部失败，则连接jPush
            // */
            //function connectWebSocket() {
            //    websocketManager
            //        .init()
            //        .then(function () {
            //
            //        }, function () {
            //            socketConnectCounter++;
            //            if (socketConnectCounter >= CONNECT_INFO.SOCKET_CONNECT_TRY_TIME) {
            //            } else {
            //                connectWebSocket();
            //            }
            //        }, function (data) {
            //            if (data.connected == 1) {
            //                thiz.data.connectStatus = true;
            //                thiz.category=1;
            //            }
            //            if (data.connected == 2) {
            //                parseSocketData(data);
            //            }
            //        });
            //}
            //
            //connectJPush();
            //
            ///**
            // * 连接Jpush
            // */
            //function connectJPush() {
            //    jPushManager.init().then(null, null, function (data) {
            //        parseJPushData(data);
            //    });
            //}

            /**
             * 解析websocket发过来的消息
             * @param data
             */
            function parseSocketData(data) {
                var type = JSON.parse(data.msg.data).type;
                switch (type) {
                    case CONNECT_INFO.LABEL_FOR_PUBLISH_WORK:
                        me.getWorkData();
                        me.getGameData();
                        break;
                    case CONNECT_INFO.LABEL_FOR_RECYCLE_WORK:
                        break;
                    case CONNECT_INFO.LABEL_FOR_SEND_PRAISE:
                        break;
                }
            }

            /**
             * 解析jpush发过来的消息
             * @param data
             */
            function parseJPushData(data) {
                console.log(data)
            }

            //connectWebSocket();
            /**
             * 获取作业的数据
             */
            this.getWorkData = function () {
                var defer = $q.defer();
                commonService.commonPost(serverInterface.GET_WORK_DATA, {
                    status: 1,
                    startTime: '2015-08-31',
                    days: 1
                }).then(function (data) {
                    $log.debug('get work data : ');
                    $log.debug(data);

                    me.data.availableWorks = data;
                    me.data.loadCount++;
                    /*debugger;
                    me.getGameData();*/
                    if(data&&data.length>0){
                        defer.resolve(false);
                    }else{
                        defer.resolve(true);
                    }

                });
                return defer.promise;
            };
            /**
             * 获取游戏的数据
             */
            this.getGameData = function () {
                var me = this;
                commonService.commonPost(serverInterface.GET_GAME_DATA, {
                    clzId: profileService.clazz.clazzId,
                    subject: 1,
                    category: $rootScope.homeOrClazz.type
                }).then(function (data) {
                    $log.debug('get game data :');
                    $log.debug(data);
                    if (data.code == 200) {
                        me.data.availableGames = data.curGames;
                        me.data.loadCount++;
                    }
                });
            }

            this.clearData=function(){
                me.data={};
            };

            this.clearGameData=function(){
                if(me.data.availableGames.length>0){
                    me.data.availableGames.splice(0,me.data.availableGames);
                }
            }
        }]);
});
