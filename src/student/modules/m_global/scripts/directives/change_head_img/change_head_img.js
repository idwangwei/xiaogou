/**
 * Created by Administrator on 2017/5/8.
 */
import './change_head_img.less';
import changeBtn from './change_head_image/change_btn.png';
import chooseBtn from './change_head_image/choose_head.png';
import templ from './change_head_img.html';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        template: templ,
        // controller: changeHeadCtrl,
        controller: ['$scope', '$state', '$ngRedux', 'profileService', '$rootScope', '$window', function ($scope, $state, $ngRedux, profileService, $rootScope, $window) {
            // $root.showChangeHeadFlag = true;
            $scope.headImgs = [];
            $scope.changeBtn = changeBtn;
            $scope.chooseBtn = chooseBtn;
            $scope.currtenHead = $ngRedux.getState().user_reward_base.avator;
            // $scope.chooseIndex = $scope.currtenHead;
            if ($scope.currtenHead == 'default') $scope.currtenHead = '1';
            for (let i = 0; i < 32; i++) {
                $scope.headImgs[i] = {};
                $scope.headImgs[i].index = i + 1;
                $scope.headImgs[i].status = false;
                if ($scope.currtenHead == $scope.headImgs[i].index) $scope.headImgs[i].status = true;
            }
            $scope.changeHead = ($event)=> {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }

                let index = 1;
                angular.forEach($scope.headImgs, (v, k)=> {
                    if ($scope.headImgs[k].status) index = $scope.headImgs[k].index;
                });
                profileService.changeHeadImg($ngRedux.dispatch, index);
                $scope.hideChangeHead();

            };
            $scope.hideChangeHead = function () {
                $rootScope.showChangeHeadFlag = false;
            };
            $scope.getHeight = function () {
                let h = $rootScope.platform.IS_ANDROID ? $window.screen.availHeight : $window.innerHeight;
                // let h = window.screen.height;
                let hh = Math.floor(h * 0.65) - 85 - 55 - 15;
                if (hh < 0) hh = 0;
                return hh;

            };
            $scope.chooseHeadImg = function (item, $event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
                angular.forEach($scope.headImgs, (v, k)=> {
                    $scope.headImgs[k].status = false;
                });
                item.status = true;
            };

            $scope.stopEvent = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
            }

        }],
        // controllerAs: 'ctrl',
        link: function ($scope, element, attrs, ctrl) {

        }
    }
}
// });
