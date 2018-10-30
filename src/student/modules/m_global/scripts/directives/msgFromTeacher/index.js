/**
 * Created by ZL on 2017/8/31.
 */
import templ from './page.html';
import './style.less';
export default function () {
    return {
        restrict: 'EA',
        scope: {
            studentName: '@',
            teacherName: '@'
        },
        template: templ,
        controller: ['$state', '$scope', '$rootScope', ($state, $scope, $rootScope)=> {
            $scope.hideMsgDialog = function () {
                $rootScope.msgDialogFlag = false;
            };

            $scope.stopEvent = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
            };
            $scope.loadlocalImages = function (imgUrl) {
                return require('./image/' + imgUrl);
            };
            $scope.getTeacherName = function () {
                if ($scope.teacherName.length < 4) {
                    return $scope.teacherName[0]
                } else {
                    return $scope.teacherName[0] + $scope.teacherName[1];
                }
            }
        }],
        link: ($scope, $element, $attrs, ctrl) => {

        }
    };
}