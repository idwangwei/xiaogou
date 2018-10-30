/**
 * Created by 彭建伦 on 2015/7/14.
 */
define(['./../index'], function (directives) {
    /**
     *
     */
    directives.directive('autoBoxCon', [function () {
        return {
            restrict: 'E',
            scope: {
                row: '@',
                decreaseHeight: '@',
                innerHeight: '='
            },
            controller: ['$scope', function ($scope) {
                this.getBlockHeight = function () {
                    var innerHeight = $scope.innerHeight || window.innerHeight;
                    return (innerHeight - ($scope.decreaseHeight || 0)) / $scope.row;
                }
            }],
            link: function ($scope, element, attrs) {

            }
        }
    }])
        .directive('autoBoxRow', [function () {
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
//                setTimeout(function(){
//                    element.css({
//                        height: autoBoxConCtrl.getBlockHeight() + 'px'
//                    });
//                },300);
                }
            }
        }])
        .directive('autoBoxBlock', [function () {
            return {
                restrict: 'E',
                link: function ($scope, element, attrs, autoBoxConCtrl) {

                }
            }
        }]);
});
