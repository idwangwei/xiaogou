/**
 * Created by ZL on 2018/3/30.
 */
import './style.less';
export default function () {
    return {
        restrict: 'AE',
        scope: {
            loading: '=',
            cancelSubmit:'='
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$ionicLoading', '$ngRedux', ($scope, $rootScope, $ionicLoading, $ngRedux) => {
            $scope.hideSubmitLoading = ()=> {
                $rootScope.showSubmitLoading = false;
                $scope.cancelSubmit();
            }
        }],
        link: function ($scope, $elem, $attrs, ctrl) {

        }
    };
}