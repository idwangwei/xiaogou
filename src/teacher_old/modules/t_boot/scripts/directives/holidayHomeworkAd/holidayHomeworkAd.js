/**
 * Created by ww on 2017/6/14.
 * 暑假假期作业广告
 */
import './holidayHomeworkAd.less';
import directives from './../index';
directives.directive('holidayHomeworkAd',()=>{
    return {
        restrict: 'E',
        scope: {
            showFlag: '=showFlag'
        },
        replace: false,
        template: require('./holidayHomeworkAd.html'),
        controller: ['$scope', function ($scope) {}],
        link: function ($scope, $element, $attrs) {

            $scope.hideAd = ()=> {
                $scope.showFlag = false;
            }
        }
    };
});
