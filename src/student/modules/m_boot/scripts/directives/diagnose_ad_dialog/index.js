/**
 * Created by Administrator on 2017/5/8.
 */
import templ from './page.html';
import './style.less';
define(['../index'], function (directives) {
    directives.directive('diagnoseAdDialog', [function () {
        return {
            restrict: 'E',
            scope: true,
            template: templ,
            controller: ['$scope', '$state', '$rootScope', '$ngRedux', 'workReportService','commonService','increaseScoreService', 
                function ($scope, $state, $rootScope, $ngRedux, workReportService,commonService,increaseScoreService) {
                $scope.currentLevel = Number($scope.currentLevel);
                $scope.nextLevel = Number($scope.currentLevel) + 1;
                let showFlag = $ngRedux.getState().pet_info.showAdAuto;
                // let showFlag = commonService.getLocalStorage('clickIncreaseScoreAD');
                if($rootScope.showDiagnoseAdDialogFlag === undefined){
                    $rootScope.showDiagnoseAdDialogFlag=showFlag;
                }

                $rootScope.firstShowDialog = showFlag;
                // $rootScope.showGameAdDialogFlag = showFlag;
                // $rootScope.showXLYAdDialogFlag = showFlag;

                $scope.hideDiagnoseDialog = function ($event) {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                    $rootScope.showDiagnoseAdDialogFlag = false;
                    $rootScope.showGameAdDialogFlag = false;
                    $rootScope.firstShowDignoseAdDialog = false;
                    // $rootScope.showXLYAdDialogFlag = false;
                    $rootScope.firstShowDialog = false;
                };

                $scope.readyGo = function ($event) {
                    if (typeof $event === 'object' && $event.stopPropagation) {
                        $event.stopPropagation();
                    } else if (event && event.stopPropagation) {
                        event.stopPropagation();
                    }
                    if ($rootScope.showDiagnoseAdDialogFlag) {
                        $scope.gotoDiagnose();
                    } else if ($rootScope.showGameAdDialogFlag) {
                        $scope.gotoDiagnose();
                    }
                };
                $scope.gotoDiagnose = function () {
                    // $rootScope.showDiagnoseAdDialogFlag = false;
                    // $rootScope.firstShowDignoseAdDialog = false;
                    // workReportService.changeDiagnoseDialogFlag();
                    increaseScoreService.changeShowAdAutoFlag();
                    if ($rootScope.firstShowDialog && $rootScope.showDiagnoseAdDialogFlag) {
                        // $state.go('home.diagnose_pk');
                        $state.go('home.diagnose02',{backWorkReportUrl: 'diagnose-ad-dialog',isIncreaseScore:true});
                        // $state.go('home.diagnose02',{isIncreaseScore:true});
                    } else if ($rootScope.showDiagnoseAdDialogFlag) {
                        $state.go('home.diagnose02', {backWorkReportUrl: 'diagnose-ad-dialog',isIncreaseScore:true});
                    } else {
                        $state.go('game_map_scene');
                    }
                    $scope.hideDiagnoseDialog();
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
