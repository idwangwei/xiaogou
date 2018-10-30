/**
 * Created by liangqinli on 2017/2/24.
 */
import './style.less'
import directives from '../index';

directives.directive('expandItem', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: `<div>
                   <div class="expand-item" ng-repeat="item in items" ng-click="handleExpand($index)" ng-class="{expanded: currentIndex === $index}">
                       <h3 class="mtitle" ng-class="{'hide-text': currentIndex !== $index}"><span>{{($index + 1 )+ '、'}}</span>{{item.title}}
                        <i ng-if="currentIndex !== $index" class="icon ion-chevron-right marrow"></i><i ng-if="currentIndex === $index" class="icon ion-chevron-down marrow"></i>
                       </h3>
                       <ul class="mcontent">
                           <li ng-repeat="info in item.infos"><span>{{'('+ ($index + 1) +').'}}</span>{{info.cont}}</li>
                       </ul>
                   </div>
                   </div>`,
        scope: {
            items: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.handleExpand = function(currentIndex){
                console.log(currentIndex);
                if($scope.currentIndex === currentIndex){
                    $scope.currentIndex = -1;
                    return;
                }
                $scope.currentIndex = currentIndex;
            }
        }],
        link: function ($scope, element, attrs) {

        }
    }
}]);

