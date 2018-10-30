/**
 * Created by WL on 2017/6/5.
 */
import directives from '../index';
import "./style.less";
import btnHow from "./../../../tImages/workStuList/how_btn.png";

directives.directive('bottomAskBtn', ['$timeout',function ($timeout) {
    return {
        restrict: 'E',
        replace: false,
        template: `<div class="bottom-ask-btn-area">
                        <!--<span class="btn-how" ng-bind="btnWord" ng-click="clickBottomAskBtn()"></span>          -->
                        <img class="new-btn-how" ng-src="{{btnHow}}" ng-click="clickBottomAskBtn()">
                  </div>`,
        scope: {
        },
        controller: ['$scope', '$rootScope', '$state',
            function ($scope, $rootScope, $state) {
                $scope.btnWord = "学生未掌握、不牢固，怎么办？  >";
                $scope.btnHow = btnHow;
                $scope.clickBottomAskBtn = function () {
                    $scope.$emit("recommend.show");
                    //$rootScope.isShowRecommendFlag = true;
                }
            }],
        link: function ($scope, element, attrs) {
            $scope.$on('$destroy', () => {

            });
        },

    }
}]);