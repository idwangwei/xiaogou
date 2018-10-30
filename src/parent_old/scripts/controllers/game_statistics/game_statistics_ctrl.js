/**
 * Created by 华海川 on 2015/12/8.
 * 通关情况
 */
import $ from 'jquery';
import controllers from './../index';

controllers.controller('gameStatisticsCtrl',
    function ($rootScope, $scope, $log, commonService, $ionicActionSheet, gameService, $state, $ionicPopup, $timeout, $ionicScrollDelegate, $interval) {
        "ngInject";
        $scope.stuName = gameService.pubGameStudent.name;
        $scope.data = gameService.errorStats;
        $scope.openFlag = true;
        gameService.getErrorByStu();

        var key = $rootScope.user.userId + "gameStatistics";
        $scope.alertTipInfo = {
            gameStatistics: commonService.getLocalStorage(key)
        };
        $scope.noTip = {
            status: false
        };

        $scope.showTip = function () {
            if (!$scope.alertTipInfo.gameStatistics) {
                $ionicPopup.alert({
                    title: '常见问题',
                    template: `<p style="color: #377AE6">问：家长端可以玩游戏吗？</p>
                <p>答：不可以，只能查看学生游戏中的错误情况及图解。需要退出登录，进入学生端才能玩游戏。</p>
                 <ion-checkbox ng-click="checkNoTip()"  style="border:none;background:none;font-size:14px">不再提示</ion-checkbox>`,
                    okText: '确定',
                    scope: $scope,
                }).then(()=> {
                    if ($scope.noTip.status)
                        commonService.setLocalStorage(key, true)
                });
            }
        };
        $scope.showTip();

        $scope.checkNoTip = function () {
            $scope.noTip.status = !$scope.noTip.status;
        };


        /**
         * 横竖屏切换时就重新动态计算
         */
        $(window).on("orientationchange", function () {

            var ionContentOld = $("#situationContent");//内容区域
            var timmer = $interval(function () {  //倒计时
                var ionContentNew = $("#situationContent");//内容区域
                if (ionContentOld != ionContentNew) {
                    $("#mainContent").css({height: ionContentNew.height() + "px"});
                    $("#bottomContent").css({height: ionContentNew.height() / 2 + "px"});
                    var domArray = $("div[my-backdrop]");
                    angular.forEach(domArray, function (dom) {
                        $(dom).css({
                            'top': ionContentNew.offset().top + "px",
                            'left': '0',
                            'height': ionContentNew.height() + "px"
                        })
                    });
                    $ionicScrollDelegate.$getByHandle('imgScroll').scrollTop();
                    $interval.cancel(timmer);
                }
            }, 100);
        });


        /**
         * 接触事件
         * @param e
         */
        $scope.onTouch = function (e) {
            $scope.oy = e.target.offsetTop;//最初到顶部的距离
            $scope.topHeight = $("#topContent").height();
            $scope.bottomHeigth = $("#bottomContent").height();
            $scope.totalHeight = $("#mainContent").height();
        };

        /**
         * 拖拽事件
         * @param e
         */
        $scope.onDrag = function (e) {
            //$log.log("=================分割线start================");
            var moveY = e.gesture.deltaY;//移动的距离
            var bottomMoveHeigth = $scope.bottomHeigth - moveY;//移动过后，下方的高度
            if (bottomMoveHeigth > 0 && bottomMoveHeigth < $scope.totalHeight) {//下方的高度只能在最大的容器中
                $("#bottomContent").css({height: bottomMoveHeigth});
                $("#topContent").css({height: ($scope.totalHeight - bottomMoveHeigth)});
            }
            //$log.log("=================分割线end================");
        }

        /**
         * 点击错误原因图片显示大图
         */
        $scope.showErrorImg = function () {
            $scope.showErrorImgFlag = true;//显示错误原因大图标志
        };

        /**
         * 点击隐藏错误原因的大图
         */
        $scope.hideErrorImg = function () {
            $scope.showErrorImgFlag = false;//显示错误原因大图标志
        };

        $scope.topHeight = $("#topContent").height();
        $scope.bottomHeigth = $("#bottomContent").height();

        /**
         * 打开或折叠图片区域
         */
        $scope.handleOpenImg = function () {
            if ($scope.openFlag == true) {
                var topHeight = $("#situationContent").height();
                var barHeight = $('#pullBar').height() || 50;
                $("#topContent").css({height: topHeight - barHeight});
                $("#bottomContent").css({height: barHeight});
                $scope.openFlag = false;
            } else {
                $("#bottomContent").css({height: '50%'});
                $("#topContent").css({height: '50%'});
                $scope.openFlag = true;
            }
        }

        $scope.back = function () {
            $state.go("home.game_list");
        };
        /*返回注册*/
        $rootScope.viewGoBack=$scope.back.bind($scope);
        $scope.help = function () {
            $ionicPopup.alert({
                title: '信息提示',
                template: '<p>点击图片可全屏查看。</p>' +
                '<p>在全屏状态下再次点击图片，可以取消全屏显示。</p>',
                okText: '确定'
            });
        }

    });
