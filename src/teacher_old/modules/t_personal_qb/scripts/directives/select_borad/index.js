/**
 * Created by ZL on 2018/4/12.
 */
import './style.less';
export default function () {
    return {
        restrict: 'AE',
        scope: {
            quesRightAns: '=',
            isShowBorad: '=',
            selectOptions:'='
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$ionicLoading', '$ngRedux', ($scope, $rootScope, $ionicLoading, $ngRedux) => {
            $scope.selectClick = function (ans) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }

                if (ans == 'del') {
                    $scope.quesRightAns = '';
                    $scope.selectOptions($scope.quesRightAns);
                } else if (ans == 'cancel') {
                    $scope.hideSelectBorad();
                } else {
                    $scope.quesRightAns = ans;
                    $scope.selectOptions($scope.quesRightAns);
                    $scope.hideSelectBorad();
                }
            };
            $scope.hideSelectBorad = function () {
                $scope.isShowBorad = false;
            }
        }],
        link: function ($scope, $elem, $attrs, ctrl) {

        }
    };
}