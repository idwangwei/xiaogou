/**
 * Created by liangqinli on 2017/1/12.
 */
import './style.less'
import directives from '../../index';

directives.directive('formRadio', [function () {
    return {
        restrict: 'E',
        template: `<div class="mFormRadio" ng-style="rootStyles">
                       <div ng-repeat="item in options" ng-click="handleSelect($index, $event)"
                        class="radioWrap" ng-class="{active: selected === $index}">
                           <em class="mCircle"></em><span class="mRadio">{{item.name}}</span>
                       </div>
                  </div>`,
        scope: {
            options: '=',
            value: '=',
            onChange: '='
        },
        controller: ['$scope', function ($scope) {
            //初始化选中的option
            $scope.selected  = $scope.options.findIndex((item) => item.value === $scope.value);
            $scope.handleSelect = function(key, ev){
                $scope.selected = key
                $scope.value=$scope.options[key].value;
                if(typeof $scope.onChange === 'function'){
                    $scope.onChange($scope.value);
                }
            };
            $scope.rootStyles= {
                width: '100%'
            }
        }],
        link: function ($scope, element, attrs) {

        }
    }
}]);