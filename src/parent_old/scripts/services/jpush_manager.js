/**
 * @author by 彭建伦 on 2015/8/27.
 */
define(['./index', 'js-base64/base64'], function (services, jsBase64) {
    services.service('jPushManager', ['$window', '$state', '$q', '$rootScope', '$timeout', '$log','localstorageDbUtil','finalData','messageServices',
        function ($window, $state, $q, $rootScope, $timeout, $log,localstorageDbUtil,finalData,messageServices) {
            var EVENTS = { //事件常量
                DEVICE_READY: 'deviceready',//设备就绪
                RECEIVE_MESSAGE: 'jpush.receiveMessage',//获取自定义消息
                SET_TAGS_WITH_ALIAS: 'jpush.setTagsWithAlias',//设置标签和别名
                OPEN_NOTIFICATION: 'jpush.openNotification',//打开通知
                RECEIVE_NOTIFICATION: 'jpush.receiveNotification',//获取通知
                RESUME:'resume'//从后台恢复到前台
            };

            var MESSAGE_TITLE = "智算365";
            var MESSAGE = {
                UNREAD: 0,
                READ: 1
            };
            var CURRENT_STATE="home.msg";
            var TAGS_WITH_ALIAS='T';
            var SENT_DB_KEY="senderId";
            var MSG_DB_KEY="msgId";


            /* var contactDb=new indexedDbUtil.Db("contacts",1);*/
            /*   contactDb.deleteDb("contacts",function(){});*/
            /*var messageDb=new indexedDbUtil.Db("message",1);*/
            /*   messageDb.deleteDb("message",function(){});*/

            /**
             * jpush 插件初始化
             */
            this.jPushInit = function () {
                $window.document.addEventListener(EVENTS.DEVICE_READY, onDeviceReady, false);
                $window.document.addEventListener(EVENTS.SET_TAGS_WITH_ALIAS, onTagsWithAlias, false);
                $window.document.addEventListener(EVENTS.RECEIVE_MESSAGE, onReceiveMessage, false);
                $window.document.addEventListener(EVENTS.OPEN_NOTIFICATION, onOpenNotification, false);
                $window.document.addEventListener(EVENTS.RECEIVE_NOTIFICATION, onReceiveNotification, false);
                $window.document.addEventListener(EVENTS.RESUME,onResume,false);
                $rootScope.jPushInitFlag=true;
            };

            /**
             * 停止推送服务
             * TODO:如果需要使用这个功能，还需要开发UI供用户选择开启或关闭
             */
            this.stopPush = function () {
                $window.plugins.jPushPlugin.stopPush();
            };

            /**
             * 恢复推送服务
             * TODO:如果需要使用这个功能，还需要开发UI供用户选择开启或关闭
             */
            this.resumePush = function () {
                $window.plugins.jPushPlugin.resumePush();
            };

            /**
             * 检查 Push Service 是否已经被停止
             */
            this.isPushStopped = function () {
                $window.plugins.jPushPlugin.resumePush(resumePushCallback);
            };

            /**
             *获取应用程序对应的 RegistrationID。 只有当应用程序成功注册到 JPush 的服务器时才返回对应的值，否则返回空字符串。
             */
            this.getRegistrationID = function () {
                window.plugins.jPushPlugin.getRegistrationID(getRegistrationIDCallBack);
            };

            /**
             * 设置角标数目
             * @param num
             */
            this.setBadgeNumber=function(num){
                if(window.plugins&&window.plugins.jPushPlugin&&window.plugins.jPushPlugin.isPlatformIOS()){
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(num);
                }

            };


            /**
             * 设备就绪的监听事件
             */
            var onDeviceReady = function () {
                $window.plugins.jPushPlugin.init();
                if ($window.plugins.jPushPlugin.isPlatformIOS()) {
                    $window.plugins.jPushPlugin.setDebugModeFromIos();//开启IOS调试模式
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                } else {
                    $window.plugins.jPushPlugin.setDebugMode(true);//开启android的调试模式
                }
                var alias = $rootScope.user.userId.replace(/\-/g, "_");
                $window.plugins.jPushPlugin.setTagsWithAlias([TAGS_WITH_ALIAS], alias);
            };

            /**
             * 设置标签通过别名方式的监听事件
             * @param event
             */
            var onTagsWithAlias = function (event) {
                try {
                    $log.log("onTagsWithAlias");
                    var result = "result code:" + event.resultCode + " ";
                    result += "tags:" + event.tags + " ";
                    result += "alias:" + event.alias + " ";
                    $log.log(result);
                }
                catch (exception) {
                    $log.log(exception);
                }
            };

            /**
             * 获取自定义消息的监听事件
             * @param event
             */
            var onReceiveMessage = function (event) {
                try {
                    var message;
                    /*if (device.platform == "Android") {
                        message = $window.plugins.jPushPlugin.receiveMessage.message;
                        var messageData = JSON.parse(Base64.decode(message));
                        messageData.params.msgType=messageData.msgType;
                        messageData.params.senderId=messageData.senderId;
                        messageData.params.senderName=messageData.senderName;
                        /!*var extraData = JSON.stringify(messageData.params);*!/
                        //$window.plugins.jPushPlugin.addLocalNotification("1",messageData.data.message,MESSAGE_TITLE,messageData.id,0,{'data':JSON.stringify(messageData.data) });
                        var dateTime=(new Date()).getTime()+"";
                        $window.plugins.jPushPlugin.addLocalNotification("1",
                            messageData.msg,
                            "智算365",
                            dateTime,
                            0,
                            {"data": messageData.params});
                    } else {
                        message = event.content;
                        debugger;
                    }
                    $log.log("接收到的自定义消息:"+message);
                    //handleMsg(messageData);
                    handleMsgByStorageDb(messageData);*/
                } catch (exception) {
                    $log.log("JPushPlugin:onReceiveMessage-->" + exception);
                }
            };

            /**
             * 打开通知的监听事件
             * @param event
             */
            var onOpenNotification = function (event) {
                try{
                    $log.log("==================打开通知start======================");
                    var alertContent,extras,messageData;
                    if (device.platform == "Android") {
                        alertContent = $window.plugins.jPushPlugin.openNotification.alert;
                        extras = $window.plugins.jPushPlugin.openNotification.extras["cn.jpush.android.EXTRA"].data;
                        $log.log("notificationExtras:" + extras);

                     /*   var notificationID=extras["cn.jpush.android.NOTIFICATION_ID"];
                        window.plugins.jPushPlugin.removeLocalNotification(notificationID);
                        $window.plugins.jPushPlugin.clearLocalNotifications();*/
                    } else {
                        alertContent = event.aps.alert;
                        extras = event.data;
                        $log.log("接收到通知:"+JSON.stringify(event));
                        $log.log("打开通知:"+event.aps.alert);
                        $log.log("打开通知extras:"+event.data);
                      /*  window.plugins.jPushPlugin.setBadge(-1);*/
                       /* window.plugins.jPushPlugin.resetBadge();*/
                      /*  messageData=JSON.parse(extras);*/
                        /* var messageData = JSON.parse(Base64.decode(extras));*/
                    }
                    messageData = JSON.parse(Base64.decode(extras));
                    $log.log("接收到通知extras解密后:"+messageData);
                    messageData.params.msgType=messageData.msgType;
                    messageData.params.senderId=messageData.senderId;
                    messageData.params.senderName=messageData.senderName;
                    handleMsgByStorageDb(messageData);
                    $state.go("home.msg");
                    $log.log("==================打开通知end======================");
                }catch(exception){
                    $log.log("JPushPlugin:onOpenNotification-->" + exception);
                }


            };

            /**
             * 收到通知的监听事件
             * @param event
             */
            var onReceiveNotification = function (event) {
                try{
                    $log.log("==================接收到通知start======================");
                    var alertContent,extras,messageData;
                    if (device.platform == "Android") {
                        alertContent = $window.plugins.jPushPlugin.receiveNotification.alert;
                        extras=$window.plugins.jPushPlugin.receiveNotification.extras["cn.jpush.android.EXTRA"].data;
                        $log.log("notificationExtras:" + extras);
                       /* messageData = JSON.parse(Base64.decode(extras));*/
                    } else {
                        $log.log("接收到通知:"+JSON.stringify(event));
                        alertContent = event.aps.alert;
                        extras=event.data;
                     /*   messageData=JSON.parse(extras);*/
                        window.plugins.jPushPlugin.setBadge(+1);
                    }
                    messageData = JSON.parse(Base64.decode(extras));
                    $log.log("接收到通知:"+alertContent);
                    $log.log("接收到通知extras:"+extras);
                    $log.log("接收到通知extras解密后:"+messageData);
                    messageData.params.msgType=messageData.msgType;
                    messageData.params.senderId=messageData.senderId;
                    messageData.params.senderName=messageData.senderName;
                    handleMsgByStorageDb(messageData);
                    $log.log("==================接收到通知end======================");
                    //alert("open Notificaiton:" + alertContent);
                }catch(exception){
                    $log.log("JPushPlugin:onReceiveNotification-->" + exception);
                }

            };

            /**
             * 检查 Push Service 是否已经被停止的回调函数
             * @param data
             */
            var resumePushCallback = function (data) {
                if (data > 0) {
                    //开启
                } else {
                    //关闭
                }
            };

            /**
             * 获取应用注册id的回调函数
             * @param data
             */
            var getRegistrationIDCallBack = function (data) {
                try {
                    $log.log("JPushPlugin:registrationID is " + data)
                } catch (exception) {
                    $log.log(exception);
                }
            };

            /**
             * 应用从后台激活到前台
             */
            var onResume=function () {
                if(window.plugins.jPushPlugin.isPlatformIOS()){//苹果就清除相应的角标
                    setTimeout(function() {
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                        $log.log("..............ios应用被激活.....................");
                    }, 0);
                }else{
                    $log.log("..............非ios应用被激活.....................");
                }
            };

            function handleMsgByStorageDb(messageData) {
                var senderInfo = {
                    senderId: messageData.senderId,
                    senderName: messageData.senderName,
                    senderRole: messageData.senderRole,
                    revId:$rootScope.userId   //TODO:临时这样处理可能会有bug
                };
                var msgInfo = {
                    msgId: messageData.id,
                    senderId: messageData.senderId,
                    otherData: JSON.stringify(messageData.params),
                    msgContent: messageData.msg,
                    msgDateTime: messageData.sendTime,
                    magStatus: MESSAGE.UNREAD
                };
                localstorageDbUtil.save(finalData.DB_CONTACTS_T,senderInfo,SENT_DB_KEY);
                localstorageDbUtil.save(finalData.DB_MSG_T,msgInfo,MSG_DB_KEY);
                if($state.current.name==CURRENT_STATE){
                    $rootScope.$emit(finalData.JPUSH_MSG_EVENT);
                  /*  $state.reload();*/
                }
            }

            /*function handleMsg(messageData) {
                var senderInfo = {
                    senderId: messageData.senderId,
                    senderName: messageData.senderName,
                    senderRole: messageData.senderRole
                };
                var msgInfo = {
                    msgId: messageData.id,
                    senderId: messageData.senderId,
                    otherData: JSON.stringify(messageData.params),
                    msgContent: messageData.msg,
                    msgDateTime: messageData.sendTime,
                    magStatus: MESSAGE.UNREAD

                };
                $rootScope.contactDb.save(senderInfo, false, function () {
                    $log.log("added a contact..........");
                });
                $rootScope.messageDb.save(msgInfo,false, function () {
                    $log.log("added a msg............");
                });
            }*/

        }

    ])
    ;
});
