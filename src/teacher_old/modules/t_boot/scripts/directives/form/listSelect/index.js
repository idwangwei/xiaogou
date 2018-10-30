/**
 * Created by Zl on 2017/5/26.
 */
import './style.less';
import directives from '../../index';

directives.directive('listSelect', [function () {
    return {
        restrict: 'E',
        scope: {
            options: '@',
            defaultOption: '@',
            showFlag: '=',
            selectValue: '=',
            onChange: '&',
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', '$ngRedux', function ($scope, $rootScope, $state, $ngRedux) {
            debugger;
            $scope.optionsObj = JSON.parse($scope.options);
            $scope.defaultIndex = Number($scope.defaultOption);
           /* $scope.onChange = $scope.onChange || function () {
                };*/


            /**
             * 隐藏选择框
             */
            $scope.hideSignWarn = function () {
                $scope.showFlag = false;
            };

            /**
             * 选择选项
             */
            $scope.selectOption = function (index, item) {
                $scope.selectValue.value = item.level;
                $scope.hideSignWarn();
               if($scope.onChange){
                   $scope.onChange();
               }
            };

            /**
             * 阻止小框的事件冒泡
             * @param $event
             */
            $scope.stopEvent = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
            };
        }],
        link: function ($scope, $element, $attrs) {
        }
    };
}]);