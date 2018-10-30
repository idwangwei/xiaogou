/**
 * Created by ZL on 2017/11/7.
 */
import './style.less';
export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', '$ngRedux','commonService', '$ionicPopup',
            function ($scope, $rootScope, $state, $ngRedux,commonService, $ionicPopup) {
                $scope.gotoMyTask = function () {
                    $state.go('credits_store_task',{fromUrl:$state.current.name});
                };
                $scope.credits = $ngRedux.getState().teacher_credits_detail;
                $scope.gotoCreditsList = function () {
                    $state.go('credits_list');
                };
                $scope.isIos = commonService.judgeSYS() === 2;
                jQuery("body").off('click','#bar-better-task').on('click','#bar-better-task',function () {
                    $scope.gotoMyTask();
                })
            }],
        link: function ($scope, $element, $attrs) {

        }
    };
}
