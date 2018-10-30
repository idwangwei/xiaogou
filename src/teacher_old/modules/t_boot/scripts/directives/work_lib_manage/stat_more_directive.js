/**
 * Author 邓小龙 on 2015/11/14.
 * @description  多个统计页面展示div指令
 */
var directives = require('./../index');
var $ = require('jquery');
directives.directive('statMoreDiv', function () {
    return {
        restrict: "EA",
        scope: true,
        link: function ($scope, ele, attrs) {
            /* var resultHeight=window.innerHeight-$("#ion-header-bar").height()-
             $("#bar-subheader").height()-40-$("#ion-footer-bar").height();*/
            var resultHeight = $('#statMoreContent').height()-50;
            ele.css({height: resultHeight + "px"});
        }
    }
}).directive('rowAutoHeight', function () {
    return {
        restrict: "EA",
        scope: true,
        link: function ($scope, ele, attrs) {
            ele.css({height: $("#situationContent").height() + "px"});
        }
    }
});

