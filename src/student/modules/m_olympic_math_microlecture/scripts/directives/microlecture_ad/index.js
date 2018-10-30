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
            $scope.hideAd = ()=> {
                $root.showOlympicMathMicrolectureAd = false;
            };
            $scope.gotoMicroUnitList = ()=> {
                $root.showOlympicMathMicrolectureAd = false;
                $state.go("home.micro_unit_list")
            };
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
};
