/**
 * Created by WL on 2017/9/15.
 */
import './style.less';
import btnPub from './../../../oral_calculation_images/oral_calculation_guide/oral_guid_btn_pub.png';
import startTimer from './../../../oral_calculation_images/oral_calculation_guide/oral_guide_start_timer.png';
import titelTeacher from './../../../oral_calculation_images/oral_calculation_guide/oral_guide_btn_title_t.png';
import titelStudent from './../../../oral_calculation_images/oral_calculation_guide/oral_guide_btn_title_s.png';

export default function () {
    return {
        restrict: 'AE',
        scope: {
            showType: '@', //0:教师端首页弹窗 1:学生端首页弹窗 2:学生端作业弹窗
            guideCallback: '&',
            goBackCallback:'&'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$ionicSlideBoxDelegate','$timeout','$ngRedux','commonService','finalData', ($scope, $rootScope, $ionicSlideBoxDelegate, $timeout,$ngRedux,commonService,finalData) => {
            $scope.titelImg = $scope.showType === 0 ? titelTeacher : titelStudent;

            $scope.btnPub = btnPub;
            $scope.startTimer = startTimer;
            $scope.isLastGuide = false;
            $scope.isFirstGuide = true;
            $scope.totalSlide = 2;
            $scope.isPC = commonService.isPC();
            $scope.isIos = commonService.judgeSYS() ==2;
            $scope.selectWork = $ngRedux.getState().wl_selected_work;
            $scope.isOralKeyboard = $scope.selectWork
                && ($scope.selectWork.publishType === finalData.WORK_TYPE.ORAL_WORK_KEYBOARD
                    || $scope.selectWork.publishType === finalData.WORK_TYPE.FINAL_ACCESS); //将期末测评的定时器开始显示与键盘口算一致，时间紧张暂时共用下

            $scope.user = $ngRedux.getState().profile_user_auth.user;
            $rootScope.showOralCalculationGuideFlag = $rootScope.showOralCalculationGuideFlag !== undefined ?
                $rootScope.showOralCalculationGuideFlag
                :($scope.showType == 0 ?
                    ($scope.user.config && $scope.user.config.oc
                        && !JSON.parse(window.localStorage.getItem($scope.user.loginName+'/PubOralCalculation')))
                    : false);

            $scope.hideGuide = function ($e) {
                if($scope.showType == 2){return}
                $rootScope.showOralCalculationGuideFlag = false;
            };

            $scope.slideHasChanged = function (index) {
                $scope.currentShowPetIndex = index;
                if (index == 0) {
                    $scope.isFirstGuide = true;
                    $scope.isLastGuide = false;
                }else if (index == $scope.totalSlide - 1) {
                    $scope.isLastGuide = true;
                    $scope.isFirstGuide = false;
                }else {
                    $scope.isLastGuide = false;
                    $scope.isFirstGuide = false;
                }
            };

            $scope.showPreGuide = function ($event) {
                $event.stopPropagation();
                $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box-v2').previous(200);
            };

            $scope.showNextGuide = function ($event) {
                $event.stopPropagation();
                $ionicSlideBoxDelegate._instances.forEach((handle)=>{
                    if(handle.$$delegateHandle == 'oral-guide-slide-box-v2'){
                        handle.next(200)
                    }
                })
            };

            $scope.loadOralImg = function(imgUrl) {
                return require('./../../../oral_calculation_images/oral_calculation_guide/' + imgUrl);
            };

            $scope.handleBtnClick = ()=>{
                if($scope.showType == 0){
                    window.localStorage.setItem($scope.user.loginName+'/PubOralCalculation',true)
                }
                $rootScope.showOralCalculationGuideFlag = false;
                $scope.guideCallback();
            };

            $scope.goBack = ()=>{
                $rootScope.showOralCalculationGuideFlag = false;
                $scope.goBackCallback();
            };
            $scope.clickContent = ($event)=>{
                $event.stopPropagation();
            }
        }],
        link: function ($scope, $elem, $attrs, ctrl) {
        }
    };
}