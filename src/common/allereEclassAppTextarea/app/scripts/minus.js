/**
 * Created by 彭建伦 on 2016/3/21.
 * 减号指令
 */
import  module from './module';
module.directive('minus', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('－');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);
