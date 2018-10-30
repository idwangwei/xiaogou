/**
 * Created by 华海川 on 2016/3/7.
 * 公共转圈
 */

define(['./../index'], function (directives) {
    directives.directive('loadingProcessing', ['$compile',function ($compile) {
        return {
            restrict: 'E',
            scope: true,
            template:require('partials/directive/loading_processing.html'),
            link: function ($scope, $element, $attrs) {
                var top = $attrs.loadTop || '100';
                $element.css({
                    'position':'absolute',
                    'textAlign':'center',
                    'zIndex':9999,
                    'width':'100%',
                    'top':top+'px'
                });
                $element.addClass('display-flex');
            }
        };
    }]);
});