/**
 * Author 邓小龙 on 2015/10/8.
 * @description 输入框指令
 */
import directives from './../index';
directives.directive('layoutBox', ["$timeout", function ($timeout) {
    return {
        restrict: 'EC',
        scope: false,
        link: function ($scope, ele, attr) {
            $timeout(function () {
                var transformScale = $(ele).css('transform');
                var matchStr = '';
                transformScale.replace(/\((.+)\)/, function (match, $1) {
                    matchStr = $1;
                });
                if (!matchStr)return;
                var scale = matchStr.split(',')[0];
                $(ele).css('marginBottom', $(ele).height() * Math.abs(scale - 1) + 5 + 'px');
            }, 500);
        }
    };
}
]);
