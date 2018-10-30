/**
 * Created by 彭建伦 on 2016/3/22.
 */
import  module from './module';
module.directive('newline', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.addClass('newline');
                element.empty();
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);