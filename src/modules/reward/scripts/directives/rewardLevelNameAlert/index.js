/**
 * Created by WL on 2017/6/14.
 */
/**
 * Created by WL on 2017/5/4.
 */
import './style.less';
import alertBoard from './../../../reward_images/levelNameAlert/alertBoard.png';
import btnComeon from './../../../reward_images/levelNameAlert/btn_come_on.png';
import btnGood from './../../../reward_images/levelNameAlert/btn_good.png';
import btnOk from './../../../reward_images/levelNameAlert/btn_ok.png';
import btnEnter from './../../../reward_images/levelNameAlert/btn_enter.png';
import circle from './../../../reward_images/levelNameAlert/circle.png';



export default function () {
    return {
        restrict: 'E',
        scope: {
            levelInfo: '='
        },
        replace: false,
        template:require('./page.html'),
        controller: ['$scope', '$rootScope', '$state',
            function ($scope, $rootScope, $state ) {
                $rootScope.showLevelNameAlert = false;
                $scope.alertBoard = alertBoard;
                $scope.btnComeon = btnComeon;
                $scope.btnGood = btnGood;
                $scope.btnOk = btnOk;
                $scope.btnEnter = btnEnter;
                $scope.circle = circle;
                $scope.tipArr = [
                    '“学霸驯宠记”，快速提升等级的法宝哟。',
                    '通关速算也会获得经验哟。',
                    '做作业得金杯时，也会有经验奖励哟。',
                    '解锁称号不要慌，先去完成每日任务吧。',
                ];


                $scope.hideNameAlert = function () {
                    $rootScope.showLevelNameAlert = false;
                };

                $scope.loadLevelNameImg = function(levelInfo) {
                    let group = levelInfo.group || 1;
                    let imgUrl = 'group' + group + "Level";
                    imgUrl += "Name" + (levelInfo.imgIndex + 1) + ".png";
                    imgUrl = "levelName/"+imgUrl;
                    return imgUrl;
                };

                $scope.getTip = function(){
                    let num = parseInt(Math.random()*4);
                    return $scope.tipArr[num];
                }


            }],
        link: function ($scope, $element, $attrs) {

        }
    };
}
