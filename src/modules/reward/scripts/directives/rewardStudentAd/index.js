/**
 * Created by Administrator on 2017/5/17.
 */
import './style.less';

export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
            $scope.hideRewardStuAd = function () {
                $rootScope.showRewardStuAd = false;
            }
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}