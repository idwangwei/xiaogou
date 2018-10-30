/**
 * Created by 华海川 on 2015/10/12.
 * 锚点操作
 */
import directives from './../index';
directives.directive('listAnchor', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
    return {
        restrict: 'A',
        scope: {
            toId: '=listAnchor'
        },
        link: function ($scope, element, attrs) {
            var count = 0;
            if ($scope.toId) {
                var t = setInterval(function () {
                    count++;
                    if (count > 50) {
                        clearInterval(t);
                    }
                    if (document.getElementById($scope.toId)) {
                        goTo($scope.toId);
                        clearInterval(t);
                    }
                }, 100);
            }

            function goTo(id) {
                var old = $location.hash();
                $location.hash(id);
                $anchorScroll();
                $location.hash(old);
            }
        }
    }
}]);
