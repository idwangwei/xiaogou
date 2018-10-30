/**
 * Created by 华海川 on 2015/10/19.
 * 轮播指令
 */
define(['./../index'], function (directives) {
    directives.directive('swiper', function () {
        return {
            restrict: 'E',
            scope: false,
            templateUrl:'../../partials/directive/swiper.html',
            controller:function($scope){
                var slideIndex = $scope.slideIndex;
                this.ready=function(){
                    var swiper = new Swiper('.swiper-container',{loop:true,initialSlide:slideIndex});
                }
            },
            link: function (scope, ele, attr) {

            }
        };
    }).directive("swiperSlide", [function() {
        return {
            restrict: "A",
            require: "^swiper",
            link: function(scope, element, attrs, ctrl) {
                if(scope.$last) {
                    setTimeout(function(){
                        ctrl.ready();
                    });

                }
            }
        }
    }]);
});