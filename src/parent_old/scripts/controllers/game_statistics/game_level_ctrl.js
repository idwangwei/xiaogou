/**
 * Created by 华海川 on 2016/3/14.
 * 游戏关卡页面
 */

import  controllers from './../index';
controllers.controller('gameLevelCtrl',
    function ($scope, gameService,$state,finalData,commonService,$rootScope) {
        "ngInject";
        gameService.getPubGameLevels().then(function(data){
            if(data.code==200){
                $scope.selectedGame=data.game;
            }else if(data.code==2016 ||data.code==2017){
                commonService.showAlert('信息提示','老师已经删除了该游戏，请重新选择');
                $state.go('home.game_list');
            }else{
                commonService.alertDialog('网络链接不畅，请稍后再试',1500);
            }
        });
        $scope.back=function () {
            $state.go("home.game_list")
        }
        //注册返回
        $rootScope.viewGoBack=$scope.back.bind($scope);
        $scope.start = finalData.START_ICON;
        $scope.gameStatistics = function (game, level) {
            gameService.pubGame.publicId = game.cgceId;
            gameService.pubGame.levelGuid = level.levelGuid;
            gameService.pubGame.kdName = level.kdName;
            gameService.pubGame.levelNum = level.num;
            gameService.pubGame.gameName = game.name;
            $state.go('game_statistics');
        }
});
