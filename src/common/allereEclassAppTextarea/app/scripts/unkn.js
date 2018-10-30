/**
 * Created by 彭建伦 on 2016/3/21.
 * 未知数指令
 */
import module from './module';
//import $ from 'jquery';
module.directive('unkn', ['$compile', function ($compile) {
    return {
        restrict: "A",
        scope: {
            value: '@',
            lazyCompile: '@'
        },
        link: function ($scope, element, attrs) {
            if (!$(element).is('[mathjax-parser]')) {
                $scope.$watch('value', function () {
                    $scope.value.replace(/\\var{(.+)?}/, function (match, $1) {
                        if (!match.length) {
                            $log.error('未知数的格式不正确！');
                        }
                        element.removeAttr('unkn').attr('mathjax-parser', '').attr('value', $1).attr('lazy-compile', $scope.lazyCompile);
                    });
                    $compile(element)($scope);
                });
            }
        }
    }
}]);
