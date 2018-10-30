/**
 * Created by 彭建伦 on 2015/7/21.
 */
import  controllers from './../index';

controllers.controller('pHomeCtrl', ['$scope', 'commonService', '$state',
    '$rootScope', '$timeout', 'jPushManager', '$log', 'messageServices', 'finalData',
    function ($scope, commonService, $state, $rootScope, $timeout, jPushManager, $log, messageServices, finalData) {
        $scope.isIos = commonService.judgeSYS() === 2;
        $scope.unRead = messageServices.unRead;//未读的消息对象
        messageServices.getUnReadMsgCount();//获取消息列表
        $scope.msgItemLine = window.innerWidth < 768 ? 4:2;
        if (!$rootScope.jPushInitFlag && $rootScope.user.userId) {
            try {
                jPushManager.jPushInit();
            } catch (e) {
                $log.log("jPushManager init error!");
            }
        }

        $rootScope.$on(finalData.JPUSH_MSG_EVENT, function () {
            /*$scope.msgData=messageServices.msgData;//消息共享数据*/
            $scope.$apply(function () {
                messageServices.getUnReadMsgCount();//获取消息列表
            });
        });

        $scope.hideWinterAd = function () {
            $rootScope.showWinterWorkFlag=false;
        };

        $scope.hideWinterBroadcast = function(){
            $rootScope.showWinterBroadcast=false;
        }

    }]);

