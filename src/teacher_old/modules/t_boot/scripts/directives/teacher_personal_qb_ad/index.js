/**
 * Created by ZL on 2018/3/28.
 */
import './style.less'
import directives from './../index';
directives.directive('teacherPersonalQbAd', ()=> {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./page.html'),
        controller: ['$state', '$scope', 'commonService', '$rootScope', '$ngRedux', '$ocLazyLoad', ($state, $scope, commonService, $rootScope)=> {
            $scope.back = ()=> {
                $rootScope.tPersonalQbAdFlag = false;
            };

            $scope.gotoMyQb = ()=> {
                $rootScope.tPersonalQbAdFlag = false;
                $state.go('pub_work_type');
            };

        }],
        link: ($scope, $element, $attrs)=> {

        }
    };
});
