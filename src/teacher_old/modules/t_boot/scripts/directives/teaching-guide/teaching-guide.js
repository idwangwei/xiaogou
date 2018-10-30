/**
 * Created by WangLu on 2017/4/14.
 */
import directives from '../index';
import "./style.less";
import arrow from "./../../../tImages/teaching_guide_arrow.png";
import figure from "./../../../tImages/guide_figure.png";
import hand1 from "./../../../tImages/guide_hand1.png";
import hand2 from "./../../../tImages/guide_hand2.png";

directives.directive('teachingGuide', ['$timeout', '$interval', '$ionicHistory', function ($timeout, $interval, $ionicHistory) {
    return {
        restrict: 'E',
        replace: false,
        template: `<div class="teaching-guide-area" ng-if="$root.isShowGuideFlag">
                       <div class="teaching-area-area-div teaching-guide-area-top" ></div>
                       <div class="teaching-area-area-div teaching-guide-area-left" ></div>
                       <div class="teaching-area-area-div teaching-guide-area-right" ></div>
                       <div class="teaching-area-area-div teaching-guide-area-bottom" ></div>
                       <!-- <div class="guide-content-bg" >-->
                       <div class="guide-content-area" ng-if="isShowTip">
                            <img class="guide-figure" id="guideFigure" ng-src="{{guideFigure}}">
                            <div class="guide-content" id="guideContent">
                                <span>{{tipContent}}</span>
                            </div>
                       </div>
                       <!-- </div>-->
                       
                        <div id="teaching-guide-hand" ng-class="isIos?'teaching-guide-hand-ios':'teaching-guide-hand'">                  
                        </div>
                   </div>`,
        scope: {
            currentShowEle: "=",
            tipContent: "@",
            stepCount: "@",
            getHighLightEle: '&',
            currentStep: "=",
        },
        controller: ['$scope', '$rootScope', '$window','commonService', function ($scope, $rootScope, $window,commonService) {
            let TAG = "timerDebug:";
            console.log('teachering guide id:' + $scope.$id);
            $scope.arrowSrc = arrow;
            $scope.guideFigure = figure;
            $scope.guideHand1 = hand1;
            $scope.guideHand2 = hand2;
            $scope.eleArr = [];
            $rootScope.isShowGuideFlag = true;
            $scope.isShowTip = false; //根据是否有提示决定是否要显示文字
            $scope.innerShowEle = {};
            $scope.isIos = commonService.judgeSYS() == 2;
            $scope.listener = {
                watch: null,
                timer1: null,
                timer2: null
            };

            $scope.initTeachingGuideData = function () {
                if (!$rootScope.isShowGuideFlag) {
                    if ($('teaching-guide').length > 1) {
                        $('teaching-guide').remove();
                    }
                    return;
                }

                if ($('teaching-guide').length > 1) {
                    $('teaching-guide').eq(0).remove();
                }
                $scope.removeWatch();

                $scope.createTimer($scope); //创建定时器
                $scope.createWatch(); //当同一个页面需要两个引导时，创建监听事件
            };


            /**
             * 通过路由更新引导显示的区域
             */
            $scope.getCurrentShowEle = function () {
                console.log(TAG + "$scope id--->" + $scope.$id);
                if (!$rootScope.isShowGuideFlag) {
                    $("teaching-guide").remove();
                    $scope.removeTimer();
                    $scope.removeWatch();
                    return;
                }
                $("[nav-view = 'cached'] teaching-guide").remove();

                if (!!$scope.tipContent && !$scope.isShowTip) {
                    $scope.isShowTip = !!$scope.tipContent;
                }
                $scope.getHighLightEle();
                $scope.initShowEleData();
            };

            $scope.initShowEleData = function () {
                if (!$scope.currentShowEle || $scope.currentShowEle.length == 0 || !$scope.currentShowEle.offset()) {
                    return;
                }
                let eleWidth = Math.floor($scope.currentShowEle.width());
                let eleHeight = Math.floor($scope.currentShowEle.height());
                if (eleWidth <= 0 || eleHeight <= 0) {
                    return;
                }

                let eleTop = Math.floor($scope.currentShowEle.offset().top);
                let eleLeft = Math.floor($scope.currentShowEle.offset().left);
                let padding = $scope.currentShowEle.css("padding");
                padding = padding.replace(/px/g, '').split(" ");
                if (padding.length == 1) {
                    padding = padding.concat(padding, padding, padding)
                } else if (padding.length == 2) {
                    padding = padding.concat(padding);
                } else if (padding.length == 3) {
                    padding.push(padding[1]);
                }
                if (padding.length == 4) {
                    eleWidth = eleWidth + Number(padding[1]) + Number(padding[3]);
                    eleHeight = eleHeight + Number(padding[0]) + Number(padding[2]);
                }

                //要显示的部分的宽高top等值
                $scope.innerShowEle = {
                    width: eleWidth,
                    height: eleHeight,
                    top: eleTop,
                    bottom: $window.innerHeight - eleHeight - eleTop,
                    left: eleLeft,
                    right: $window.innerWidth - eleLeft - eleWidth,
                };

                $scope.initDivAreaStyle();
            };

            /**
             * 设置四个遮罩区域的属性值
             */
            $scope.initDivAreaStyle = function () {
                if (!$scope.innerShowEle.width)return;
                $scope.removeTimer(); //移除定时器

                $scope.topDiv = $(".teaching-guide-area-top");
                $scope.bottomDiv = $(".teaching-guide-area-bottom");
                $scope.leftDiv = $(".teaching-guide-area-left");
                $scope.rightDiv = $(".teaching-guide-area-right");

                //topArea
                $scope.topDiv.css("height", $scope.innerShowEle.top);

                //bototmArea
                $scope.bottomDiv.css("top", $scope.innerShowEle.top + $scope.innerShowEle.height);
                $scope.bottomDiv.css("height", $scope.innerShowEle.bottom+20);

                //leftArea
                $scope.leftDiv.css("top", $scope.innerShowEle.top);
                $scope.leftDiv.css("width", $scope.innerShowEle.left);
                $scope.leftDiv.css("height", $scope.innerShowEle.height);

                //rightArea
                $scope.rightDiv.css("top", $scope.innerShowEle.top);
                $scope.rightDiv.css("width", $scope.innerShowEle.right);
                $scope.rightDiv.css("height", $scope.innerShowEle.height);

                if ($(".guide-content-area").width()) {
                    $scope.showContent();
                }
                $scope.showHand();
            };


            /**
             * 显示文字
             */
            $scope.showContent = function () {
                if($rootScope.oralCalculationGuidFlag) return;
                if (!$scope.isShowTip) return;
                let limitTmp = 50;
                let width = $(".guide-content-area").width();
                let height = $(".guide-content-area").height();
                let left = Math.floor(($window.innerWidth - width) / 2);
                $(".guide-content-area").css("left", left);

                let contentTop = Math.floor(($window.innerHeight - height) / 2);
                let middleLine = Math.floor($window.innerHeight / 2);

                let eleMaxTop = $scope.innerShowEle.top + $scope.innerShowEle.height;
                if (eleMaxTop < middleLine) { //高亮的元素在上方
                    contentTop = eleMaxTop + limitTmp;
                } else if ($scope.innerShowEle.top > middleLine) { //高亮的元素在下方
                    contentTop = $scope.innerShowEle.top - height - limitTmp;
                } else {
                    contentTop = eleMaxTop + limitTmp;
                }

                $(".guide-content-area").css("top", contentTop);

                let figureRight = $window.innerWidth < 768 ? "-20px" : '0';
                $("#guideFigure").css("opacity", "1");
                $("#guideFigure").css("right", figureRight);
                $timeout(function () {
                    $("#guideContent").css("opacity", "1");
                }, 1000);
            };

            /**
             * 显示小手
             */
            $scope.showHand = function () {
                $scope.currentShowEle.one("click", $scope.clickCurrentEle.bind($scope));
                let hand = $("#teaching-guide-hand"),
                    elePos = $scope.innerShowEle,
                    handWidth = hand.width(),
                    handHeight = hand.height(),
                    handBottom = 0,
                    handRight = 0;

                if($window.innerWidth >=768){
                    handRight = elePos.right + elePos.width / 3;
                }else{
                    handRight = Math.abs(elePos.width + elePos.right - handWidth);
                    if ((elePos.width + elePos.right) > handWidth * 2 && (elePos.width + elePos.left) > handWidth * 2) {
                        handRight = handRight / 2;
                    } else if (elePos.left > elePos.right) { //偏右
                        handRight = handRight - elePos.width / 2;
                    } else if (elePos.left <= elePos.right && elePos.left + elePos.width > handWidth * 2) {
                        handRight = handRight + elePos.width / 2;
                    }
                }

                handBottom = Math.abs(elePos.bottom + elePos.height - handHeight);
                handBottom = handBottom - elePos.height / 2;

                hand.css("right", handRight);
                hand.css("bottom", handBottom);
                hand.css("opacity", 1);
            };

            $scope.clickCurrentEle = function (e) {
                $("#teaching-guide-hand").css("opacity", 0);
            };

            /**
             * 创建定制器，判断dom元素渲染完毕后再去设置引导遮罩层的宽和高
             */
            $scope.createTimer = function (_$scope) {
                _$scope.removeTimer();

                $scope.listener.timer1 = $interval(function () {
                    console.log(TAG + "timer1 callback");
                    _$scope.getCurrentShowEle();
                }, 200);
                console.warn(TAG + "add timer1 id---" + $scope.listener.timer1.$$intervalId + ";$scope id--->" + _$scope.$id);

                $scope.listener.timer2 = $timeout(function () {
                    console.log(TAG + "timer2 callback");
                    _$scope.removeTimer();
                    _$scope.getCurrentShowEle();
                    if (_$scope.stepCount == $scope.currentStep) {
                        _$scope.removeWatch();
                        _$scope.$destroy();
                    }

                }, 2000);
            };

            /**
             * 移除定时器
             */
            $scope.removeTimer = function () {
                if ($scope.listener.timer1) {
                    console.log(TAG + "remove timer1 id---" + $scope.listener.timer1.$$intervalId);
                    $interval.cancel($scope.listener.timer1); //移除定时器
                    $scope.listener.timer1 = null;
                }
            };

            $scope.removeTimer2 = function () {
                if ($scope.listener.timer2) {
                    $timeout.cancel($scope.listener.timer2); //移除定时器
                    $scope.listener.timer2 = null;
                }
            };

            $scope.watchFn = function () {
                if ($scope.currentShowEle && $scope.currentShowEle.length > 0) {
                    $scope.currentShowEle.length = 0;
                }
                $scope.innerShowEle = {};
                $scope.removeTimer2();
                $scope.createTimer($scope);
                $("#guideFigure").css("right", "600px");
                $("#guideFigure").css("opacity", "0");
                $("#guideContent").css("opacity", "0");
            };

            /**
             * 创建监听
             */
            $scope.createWatch = function () {
                $scope.removeWatch();
                if (!!$scope.stepCount && $scope.stepCount > 1) {
                    $scope.listener.watch = $scope.$watch("currentStep", $scope.watchFn.bind($scope));
                } else {
                    $scope.stepCount = 1;
                    $scope.currentStep = 1;
                }
            };

            $scope.removeWatch = function () {
                if ($scope.listener.watch) {
                    $scope.listener.watch();
                    $scope.listener.watch = null;
                }
            };

            $scope.closeGuide = function () {
                $rootScope.isShowGuideFlag = false;
            };


        }],
        link: function ($scope, element, attrs) {
            $scope.initTeachingGuideData();
            $scope.$on('$destroy', () => {
                $scope.removeTimer();
                $scope.removeTimer2();
            });
        },

    }
}]);