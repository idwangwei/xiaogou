/**
 * Created by �?��  on 2015/10/25.
 */
import directives from './../index';
import 'libs/circliful/js/jquery.circliful';
directives.directive('statCircle', function () {
    return {
        restrict: "A",
        scope: {
            text: '=referText',
            percent: '=referPercent'
        },
        link: function ($scope, element, attr) {
            element[0].dataset['text'] = $scope.text;
            element[0].dataset['percent'] = $scope.percent;
            element[0].dataset['fgcolor'] = "#C75050";
            element[0].dataset['fontsize'] = "15px red";
            $(element).circliful();
        }
    }
});

