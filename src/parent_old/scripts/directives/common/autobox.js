/**
 * Created by 彭建伦 on 2015/7/14.
 */
import directives from './../index';

directives.directive('autoBoxCon', [function () {
    return {
        restrict: 'E',
        scope: {
            row: '@',
            decreaseHeight: '@'
        },
        controller: ['$scope', function ($scope) {
            this.getBlockHeight = function () {
                return (window.innerHeight - ($scope.decreaseHeight || 0)) / $scope.row;
            }
        }],
        link: function ($scope, element, attrs) {

        }
    }
}]).directive('autoBoxRow', [function () {
    return {
        restrict: 'E',
        require: '^autoBoxCon',
        scope: {
            fillRowBlank: '@',
            column: '@'
        },
        link: function ($scope, element, attrs, autoBoxConCtrl) {
            $scope.column = $scope.column || 1;
            var cLen = element.children('auto-box-block').length;
            if (!$scope.fillRowBlank && $scope.column > cLen) {
                for (var i = 0; i < $scope.column - cLen; i++) {
                    element.append('<div class="flex_1"></div>')
                }
            }
            element.css({
                height: autoBoxConCtrl.getBlockHeight() + 'px'
            });
        }
    }
}]).directive('autoBoxBlock', [function () {
    return {
        restrict: 'E',
        link: function ($scope, element, attrs, autoBoxConCtrl) {

        }
    }
}]);

