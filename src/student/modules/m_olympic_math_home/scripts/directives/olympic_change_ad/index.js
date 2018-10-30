/**
 * Created by ww on 2017/6/14.
 * 假期作业广告
 */
import './style.less';
export default function () {
    return {
        restrict: 'E',
        replace: false,
        scope:true,
        template: require('./page.html'),
        controller: ['$scope','$rootScope','$state','profileService', function ($scope,$rootScope,$state,profileService) {
            $scope.hideAd = ()=> {
                $rootScope.showOlypicMathChagneAd = false;
            };
            $scope.gotoMicrolecture = ($event)=>{
                $event.stopPropagation();
                $scope.hideAd();
                profileService.changeCheckedOlympicChangeAdFlag();
                $state.go('home.micro_unit_list')
            }
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
};
