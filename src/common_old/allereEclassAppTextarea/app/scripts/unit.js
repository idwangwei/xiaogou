/**
 * Created by 彭建伦 on 2016/3/21.
 * 单位指令
 */
import  module from './module';
import  $ from 'jquery';
module.directive('unit', ['$log', '$compile', function ($log, $compile) {
    return {
        restrict: "A",
        scope: {
            value: '@',
            lazyCompile:'@'
        },
        link: function ($scope, element, attrs) {
            if (!$(element).is('[mathjax-parser]')) {
                $scope.$watch('value', function () {

                    //==========================如果是键盘中的unit,则都使用lazyCompile================================
                    if ($(element).parents('.keyboard').length) {
                        $scope.lazyCompile = false;
                    }
                    $scope.value.replace(/\\unit{(.+)?}{(.+)?}{(.+?)}/, function (match, $1, $2, $3) {
                        if (!match.length) {
                            $log.error('单位的格式不正确！');
                        }
                        var option = $3.split('');
                        if (option.length != 2 || ['0', '1'].indexOf(option[0]) == -1 || ['0', '1'].indexOf(option[1]) == -1) {
                            $log.error('单位的格式不正确！第三个花括号中只可能是00|01|10|11');
                        }
                        if (option[0] == 0 && option[1] == 0) { //显示中文加括号
                            element.html('(' + $2 + ')');
                            $scope.$emit('apptextarea.subdirective.render', element);

                        }
                        if (option[0] == 0 && option[1] == 1) { //显示中文不加括号
                            element.html($2);
                            $scope.$emit('apptextarea.subdirective.render', element);
                        }
                        if (option[0] == 1 && option[1] == 0) { //显示英文加括号
                            if ($1.indexOf('^') != -1) { //如果内容中有 ‘^’，则表示有平方，需要用maxjax转化
                                var $parser = $('<span></span>').attr('mathjax-parser', '').attr('value', '(' + $1 + ')').attr('lazy-compile', $scope.lazyCompile);
                                element.empty().append($parser);
                                $compile($parser)($scope);
                            } else {
                                element.html('(' + $1 + ')');
                                $scope.$emit('apptextarea.subdirective.render', element);
                            }
                        }
                        if (option[0] == 1 && option[1] == 1) { //显示英文不加括号
                            if ($1.indexOf('^') != -1) { //如果内容中有 ‘^’，则表示有平方，需要用maxjax转化
                                var $parser = $('<span></span>').attr('mathjax-parser', '').attr('value', $1).attr('lazy-compile', $scope.lazyCompile);
                                element.empty().append($parser);
                                $compile($parser)($scope);
                            } else {
                                element.html($1);
                                $scope.$emit('apptextarea.subdirective.render', element);
                            }
                        }
                    });
                })
            }
        }
    }
}]);
