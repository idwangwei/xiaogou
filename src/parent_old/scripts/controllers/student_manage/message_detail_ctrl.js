/**
 * Created by 邓小龙 on 2015/11/24.
 *
 */
import  controllers from './../index';

controllers.controller('messageDetailCtrl', ['$scope', '$state', '$log', 'messageServices','$rootScope',
    function ($scope, $state, $log, messageServices,$rootScope) {

        $scope.msgData = messageServices.msgData;//消息共享数据

        messageServices.getMsgDetail();//获取消息明细

        $scope.msgHandle = function (msgDetail) {
            var data = JSON.parse(msgDetail.otherData);
            var msgType = data.msgType;
            switch (msgType) {
                case 10000:
                    $state.go("home.work_list", {
                        'sId': data.senderId,
                        'sName': data.senderName
                    });
                    break;
                default :
                    break;
            }

        };

        $scope.back=function () {
            $state.go("home.msg")
        }
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
    }]);

