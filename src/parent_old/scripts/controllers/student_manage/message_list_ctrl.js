/**
 * Created by 邓小龙 on 2015/11/24.
 *
 */
import  controllers from './../index';

controllers.controller('messageListCtrl', ['$scope', '$state', '$log', '$rootScope', 'messageServices', 'finalData', 'jPushManager',
    function ($scope, $state, $log, $rootScope, messageServices, finalData, jPushManager) {

        $scope.tip = "还没有收到消息";
        $scope.msgData = messageServices.msgData;//消息共享数据
        messageServices.getMsgList();//获取消息列表

        $rootScope.$on(finalData.JPUSH_MSG_EVENT, function () {
            $scope.tip = "还没有收到消息";
            messageServices.clearData();
            $scope.msgData = messageServices.msgData;//消息共享数据
            $scope.$apply(function () {
                messageServices.getMsgList();//获取消息列表
            });
        });

        /**
         * 跳转到消息明细
         */
        $scope.goMsgDetail = function (item) {
            $scope.msgData.senderId = item.senderId;
            $scope.msgData.senderName = item.senderName;
            $scope.msgData.senderImgUrl = item.imgUrl;
            jPushManager.setBadgeNumber(-item.msgNotViewedCount);
            item.msgNotViewedCount = 0;
            $state.go("message_detail");
        }

        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)
    }]);


