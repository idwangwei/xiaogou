/**
 * Created by 邓小龙 on 2016/07/08.
 */
import  _ from 'underscore';
import  $ from 'jquery';
import 'marqueeJs';
var allereMarqueeDirective = angular.module('allereMarqueeDirective', []);
allereMarqueeDirective.directive('allereMarquee',["$compile", "$log", "$timeout", function ($compile, $log, $timeout) {//根据IMG_SERVER配置的地址动态加载图片
    return {
        restrict:'EA',
        /*scope:{
            speed:'@'
        },*/
        scope:true,
        //transclude: true,
        replace:false,
        controller:['$scope', function ($scope) {
            /**
             * 暂停或者释放滚动
             */
            $scope.pauseFlag = false;
            $scope.pauseOrResumeMarquee=function () {
                $scope.pauseFlag = !$scope.pauseFlag;
                if($scope.pauseFlag)
                    $scope.marqueeEle.marquee('pause');
                else
                    $scope.marqueeEle.marquee('resume');
            };
        }],
        //template:' <div class="scroll-block" ng-transclude></div>',
        link: function ($scope, element, attrs) {
            let s = $scope.speed;
            $timeout(function () {
                $scope.marqueeEle=$(element).marquee({
                    direction:'up',
                    pauseOnHover:false,
                    delayBeforeStart:100,
                    // duration: s || 10000,
                    duration: 5000
                });
            });

        }
    }
}]);

