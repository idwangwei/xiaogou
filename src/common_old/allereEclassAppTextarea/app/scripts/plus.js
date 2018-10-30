/**
 * Created by 彭健伦 on 2016/3/21.
 * 加号指令
 */
import  module from './module';
module.directive('plus', [function () {
    return {
        restrict: "A",
        scope: {
            value: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.$watch('value', function () {
                element.html('＋');
                $scope.$emit('apptextarea.subdirective.render', element);
            })
        }
    }
}]);
