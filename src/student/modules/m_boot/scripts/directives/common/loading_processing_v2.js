/**
 * Created by ww on 2016/11/23.
 * 加载数据
 */

define(['./../index'], function (directives) {
    directives.directive('loadingProcessingV2', ['$compile',function ($compile) {
        return {
            restrict: 'E',
            scope: true,
            replace:true,
            template:require('../../partials/directive/loading_processing_v2.html'),
            link: function ($scope, $element, $attrs) {}
        };
    }]);
});