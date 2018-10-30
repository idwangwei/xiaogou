/**
 * Created by WL on 2017/9/15.
 */
import './style.less';
import btnPub from './oral_calculation_images/oral_guid_btn_pub.png';
import titelTeacher from './oral_calculation_images/t_oral_guide_btn_title_t.png';
import titelStudent from './oral_calculation_images/t_oral_guide_btn_title_s.png';

export default function () {
    return {
        restrict: 'AE',
        scope: {
            showType: '@',
            guideCallback: '&'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '$timeout','$ngRedux', ($scope, $rootScope, $ionicSlideBoxDelegate, $timeout,$ngRedux) => {
            if ($scope.showType == 0) {
                $scope.isTeacher = false;
            } else if ($scope.showType == 1) {
                $scope.isTeacher = true;
            }
            $scope.titelTeacher = titelTeacher;
            $scope.titelStudent = titelStudent;
            $scope.btnPub = btnPub;
            $scope.isLastGuide = false;
            $scope.isFirstGuide = true;
            $scope.totalSlide = 3;
            $rootScope.showOralCalculationGuideFlag = $ngRedux.getState().profile_user_auth.user.config
                && $ngRedux.getState().profile_user_auth.user.config.oc
                && !window.localStorage.getItem('PubOralCalculation');
            $scope.stopEvent = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
            };
            $scope.gotoPublish = function () {
                window.localStorage.setItem('PubOralCalculation',true);
                $scope.hideGuide();
                if ($scope.guideCallback)  $scope.guideCallback();
            };

            $scope.hideGuide = function ($e) {
                $rootScope.showOralCalculationGuideFlag = false;
            };
            $scope.slideHasChanged = function (index) {
                $scope.currentShowPetIndex = index;
                if (index == 0) {
                    $scope.isFirstGuide = true;
                    $scope.isLastGuide = false;
                } else if (index == $scope.totalSlide - 1) {
                    $scope.isLastGuide = true;
                    $scope.isFirstGuide = false;
                } else {
                    $scope.isLastGuide = false;
                    $scope.isFirstGuide = false;
                }
            };
            $scope.showPreGuide = function ($event) {
                $event.stopPropagation();
                $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box-teacher')._instances[0].previous(200);
            };

            $scope.showNextGuide = function ($event) {
                $event.stopPropagation();
                $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box-teacher')._instances[0].next(200);
            };

            $scope.loadOralImg = function (imgUrl) {
                return require('./oral_calculation_images/' + imgUrl);
            };


        }],
        link: function ($scope, $elem, $attrs, ctrl) {
            $scope.titelTeacher = titelTeacher;
            $scope.titelStudent = titelStudent;
        }
    };
}