/**
 * Created by 彭建伦 on 2016/3/21.
 * 输入框光标指令
 */
import  module from './module';
import $ from 'jquery';
module.directive('cursor', ['$interval', function ($interval) {
    return {
        restrict: "E",
        link: function ($scope, element, attrs) {
            element.addClass('cursor').addClass('cursorShow');
            var interval = $interval(function () {
                element.toggleClass('cursorShow').toggleClass('cursorHide');
            }, 500);
            $scope.$on('$destroy', function () {
                $interval.cancel(interval);
            });
        }
    }
}]);