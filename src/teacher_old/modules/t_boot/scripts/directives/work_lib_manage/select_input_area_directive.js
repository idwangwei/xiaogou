/**
 * Author 邓小龙 on 2015/9/23.
 * @description 弹出选择框的指令
 */
define(['./../index'], function (directives) {
    directives.directive('selectInputArea', function () {
        return {
            restrict: "C",
            scope:true,
            link: function ($scope, ele, attrs) {
                angular.element(ele).css('background-color', '#FAFAD2');
            }
        }
    });
});