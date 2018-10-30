/**
 * Created by WL on 2017/6/12.
 */

import templ from './diagnose_find_weak.html';
import './style.less';
// define(['../index'], function (directives) {
export default function () {
        return {
            restrict: 'E',
            scope: {
                clickFindBtn: "&"
            },
            template: templ,
            controller: ['$scope', '$state', '$rootScope','$timeout',function ($scope, $state, $rootScope,$timeout) {
                $rootScope.showFindWeakFlag = false;
                $scope.clickFindBtnFlag = false;

                $scope.clickBtn = function () {
                    $scope.clickFindBtnFlag = true;
                    $scope.clickFindBtn();
                    $timeout(function () {
                        $scope.clickFindBtnFlag = false;
                    },2000);
                };


            }],
            link: function ($scope, element, attrs, ctrl) {

            }
        }
    }
// });
