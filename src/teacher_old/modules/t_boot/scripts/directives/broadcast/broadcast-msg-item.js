/**
 * Author ww on 2017/2/15.
 * @description
 */
import  directives from './../index';


directives.directive('broadcastMsgItem', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            item:'=msgItem',
            lineCount:'@lineCount'
        },
        replace:true,
        template:require('./broadcast-msg-item-template.html'),
        link: function ($scope, element, attr) {
            $scope.msgType = {
                work:1,//-表示作业（假期和普通作业）
                game:2,//-表示游戏（普通游戏）
                computeLevel:3,//-表示速算（正常玩游戏）
                computeChallenge:4,//-表示速算（挑战玩家）
                diagnoseSingle:5,//-表示驯宠（单题）
                diagnosePaper:6,//-表示驯宠（作业）
            };
        }
    };
}]);
