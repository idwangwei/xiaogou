/**
 * Created by 彭建伦 on 2016/3/21.
 * 空格指令
 */
import module from './module';
module.directive('space', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('&nbsp;&nbsp;');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);