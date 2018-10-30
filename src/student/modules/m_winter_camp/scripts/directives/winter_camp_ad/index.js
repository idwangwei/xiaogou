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
        controller: ['$scope','$rootScope','$state', function ($scope,$root,$state) {
            // $scope.showFlag = true;
            $scope.hideAd = ()=> {
                $root.showWinterCampAd = false;
            };
            $scope.gotoWinterCampHome = ($event)=>{
                $event.stopPropagation();
                $scope.hideAd();
                $state.go('home.winter_camp_home')
            }
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
};
