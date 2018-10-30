/**
 * Created by WL on 2017/5/4.
 */
import './style.less';
import add_share from './../rewardAdd/images/add_share.png';
import add_tip from './../rewardAdd/images/add_tip.png';
import colorLeft from './../rewardAdd/images/color_bar6.png';
import colorRight from './../rewardAdd/images/color_bar7.png';


export default function () {
    return {
        restrict: 'E',
        scope: true,
        replace: false,
        template:require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', 'commonService', function ($scope, $rootScope, $state , commonService) {
            $scope.addShare = add_share;
            $scope.addShareContent = add_tip;
            $scope.colorLeft = colorLeft;
            $scope.colorRight = colorRight;
            $rootScope.showRewardAdTipFlag = false;

        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}
