/**
 * Created by WL on 2017/9/15.
 */
import './style.less';
import btnPub from './../../../oral_calculation_images/oral_calculation_guide/oral_guid_btn_pub.png';
import titelTeacher from './../../../oral_calculation_images/oral_calculation_guide/oral_guide_btn_title_t.png';
import titelStudent from './../../../oral_calculation_images/oral_calculation_guide/oral_guide_btn_title_s.png';

export default function () {
    return {
        restrict: 'AE',
        scope: {
            showType: '@',
            guideCallback: '&'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$ionicSlideBoxDelegate','$timeout', ($scope, $rootScope, $ionicSlideBoxDelegate, $timeout) => {
            if($scope.showType == 0){
                $scope.isTeacher = false;
            }else if($scope.showType == 1){
                $scope.isTeacher = true;
            }
            $scope.titelTeacher = titelTeacher;
            $scope.titelStudent = titelStudent;
            $scope.btnPub = btnPub;
            $scope.isLastGuide = false;
            $scope.isFirstGuide = true;
            $scope.totalSlide = 3;
            $rootScope.showOralCalculationGuideFlag = false;

            $scope.hideGuide = function ($e) {
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
                $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box').previous(200);
               /* $scope.currentShowPetIndex = $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box').currentIndex();
                if ($scope.currentShowPetIndex == 0) {
                    $scope.isFirstGuide = true;
                    $scope.isLastGuide = false;
                } else {
                    $scope.isLastGuide = false;
                    $scope.isFirstGuide = false;
                }*/
            };

            $scope.showNextGuide = function ($event) {
                $event.stopPropagation();
                $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box').next(200);
               /* $scope.currentShowPetIndex = $ionicSlideBoxDelegate.$getByHandle('oral-guide-slide-box').currentIndex();
                if ($scope.currentShowPetIndex == $scope.totalSlide - 1) {
                    $scope.isLastGuide = true;
                    $scope.isFirstGuide = false;
                } else {
                    $scope.isLastGuide = false;
                    $scope.isFirstGuide = false;
                }*/
            };

            $scope.loadOralImg = function(imgUrl) {
                return require('./../../../oral_calculation_images/oral_calculation_guide/' + imgUrl);
            };

        }],
        link: function ($scope, $elem, $attrs, ctrl) {
        }
    };
}