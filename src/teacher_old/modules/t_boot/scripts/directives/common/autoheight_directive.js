define(['./../index'], function (directives) {
    directives.directive('autoHeight', [function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                var clientHeight =window.innerHeight;
                var offset = element.attr('auto-height');
                var offsetNum = parseInt(offset);
                element.css({
                    height: (clientHeight - offsetNum) + 'px'
                });
            }
        }
    }]);
});