/**
 * Author 邓小龙 on 2017/1/25.
 * @description
 */
import  directives from './../index';

directives.directive('imgLoad', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var fn = $parse(attrs.imgLoad);
            elem.on('load', function (event) {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                });
            });
        }
    };
}]);
