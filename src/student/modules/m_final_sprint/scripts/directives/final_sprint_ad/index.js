/**
 * Created by ZL on 2017/12/11.
 */
import './style.less';
import $ from 'jquery';
export default function () {
    return {
        restrict: 'E',
        scope: {
            rewards: '=',
            allAwardFlag: '=',
            refresh: '&'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$timeout', '$state', 'commonService', '$ionicPopup', '$ngRedux', '$ionicViewSwitcher', '$ionicScrollDelegate',
            function ($scope, $rootScope, $timeout, $state, commonService, $ionicPopup, $ngRedux, $ionicViewSwitcher, $ionicScrollDelegate) {
                $scope.isIos = commonService.judgeSYS() == 2;
                let loginName = $ngRedux.getState().profile_user_auth.user.loginName;
                // let notfinalSprintAdFlag = window.localStorage.getItem('notfinalSprintAdFlag');
                // $rootScope.finalSprintAdFlag = !notfinalSprintAdFlag || notfinalSprintAdFlag && notfinalSprintAdFlag != loginName;
                $scope.hideFinalSprintAdDialog = function () {
                    $rootScope.finalSprintAdFlag = false;
                    // window.localStorage.setItem('notfinalSprintAdFlag', loginName);
                };
                $scope.currentV = $ionicScrollDelegate.$getByHandle('sprint_scroll');
                $scope.screenHeight = window.innerHeight;
                $scope.gotoFinalSprintPage = function () {
                    /*清空当前周到state*/
                    $scope.hideFinalSprintAdDialog();
                    $state.go('final_sprint_home',{from:"study_index"});
                    $ionicViewSwitcher.nextDirection("forward")
                };

                $scope.hideUpMark = function () {
                    $('.ad-footer-content .up-mark').hide();
                    $('.ad-footer-content .up-mark .ion-chevron-up').eq(0).removeClass('up-mark-animation');
                };

                $scope.showUpMark = function () {
                    let moveData = $scope.currentV.getScrollPosition().top;
                    if (moveData >= $('.ad-content').eq(0).height()-$scope.screenHeight-10) return;
                    $('.ad-footer-content .up-mark').show();
                    $('.ad-footer-content .up-mark .ion-chevron-up').eq(0).addClass('up-mark-animation');
                };
            }],
        link: function ($scope, $element, $attr, ctrl) {
        }
    };
}