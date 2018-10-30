/**
 * Author 邓小龙 on 2015/11/14.
 * @description  选择区域展示div指令
 */
var directives = require('./../index');
var $ = require('jquery');
directives.directive('backdropForAssist', function () {
    return {
        restrict: "C",
        scope: true,
        link: function ($scope, ele, attrs) {
            var resultHeight = window.innerHeight-44;
            ele.css({height: resultHeight + "px"});
        }
    }
});

