/**
 * Created by Administrator on 2017/5/8.
 */

import templ from './reward_dialog.html';
import './reward_dialog.less';

// define(['../index'], function (directives) {
export default function () {
    return {
        restrict: 'E',
        scope: {
            currentLevel: '@',
            levelUp: '@',
            experience: '@',
            credits: '@',
            currentPage: '@',
        },
        template: templ,
        controller: ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
            $scope.currentLevel = Number($scope.currentLevel);
            $scope.nextLevel = Number($scope.currentLevel) + 1;
            $scope.hideRewardDialog = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }

                $rootScope.showRewardDialogFlag = false;
                $rootScope.dialogType = '';
            };
            $scope.gotoSrote = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
                $rootScope.showRewardDialogFlag = false;
                $rootScope.dialogType = '';
                let backUrl = $scope.currentPage || 'home.study_index';
                $state.go('reward_day_task', {backUrl: backUrl});
            };
            $scope.loadImg = function (imageUrl) {
                return require('./reward_dialog_images/' + imageUrl);
            };
            $scope.getWidth = function () {
                let currentExpr = Math.floor((Number($scope.experience) / Number($scope.levelUp)) * 100);
                if (currentExpr > 100) currentExpr = 100;
                if (currentExpr < 0) currentExpr = 0;
                return currentExpr;
            }

        }],
        link: function ($scope, element, attrs, ctrl) {

        }
    }
}
// });
