/**
 * Created by 彭建伦 on 2015/7/14.
 */
import directives from './../index';
directives.directive('centerBox', [function () {
    return {
        restrict: 'E',
        scope: false,
        link: function ($scope, element) {
            var winWidth = window.innerWidth;
            var eWidth = element[0].offsetWidth;
            element.css({
                left: winWidth / 2 - eWidth / 2 - 10 + 'px'
            });
        }
    }
}]);


