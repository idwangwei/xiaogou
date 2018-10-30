/**
 * Created by Administrator on 2017/5/8.
 */
import templ from './page.html';
import './style.less';
define(['../index'], function (directives) {
    directives.directive('homeAdDialog', [function () {
        return {
            restrict: 'E',
            scope: true,
            template: templ,
            controller: ['$scope', '$state', '$rootScope', '$ngRedux', 'workReportService', function ($scope, $state, $rootScope, $ngRedux, workReportService) {
                $scope.currentLevel = Number($scope.currentLevel);
                $scope.nextLevel = Number($scope.currentLevel) + 1;
                let showFlag = !$ngRedux.getState().diagnose_ad_dialog_flag;
                $rootScope.showHomeAdDialogFlag = showFlag;

                $scope.hideDiagnoseDialog = function ($event) {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                    // $rootScope.firstShowDignoseAdDialog = false;
                    $rootScope.showHomeAdDialogFlag = false;
                };
                
                $scope.loadlocalImages = function (imgUrl) {
                    return require('./images/' + imgUrl);
                };

                $scope.readyGo = function ($event) {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                    $scope.gotoPages();
                };
                $scope.gotoPages = function () {
                    workReportService.changeDiagnoseDialogFlag();
                    $scope.goToXlyPage();

                };

                $scope.goToXlyPage = function () {
                    let xlyVipFlag = false;
                    if ($ngRedux.getState().profile_user_auth.user.vips) {
                        angular.forEach($ngRedux.getState().profile_user_auth.user.vips, (v, k)=> {
                            if ($ngRedux.getState().profile_user_auth.user.vips[k].xly) xlyVipFlag = true;
                        });
                    }
                    if (xlyVipFlag) {
                        $state.go('smart_training_camp', {backUrl: "home.study_index"});
                    } else {
                        $state.go('xly_select', {backUrl: "home.study_index"});
                    }
                }

            }],
            link: function ($scope, element, attrs, ctrl) {

            }
        }
    }])
});
