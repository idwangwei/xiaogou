/**
 * Created by ZL on 2017/6/13.
 */
import './style.less';
import rewardPromptBg from './images/rewardPromptBg.png';
import rewardPromptC1 from './images/rewardPromptContent1.png';
import rewardPromptButn from './images/rewardPromptButn.png';
import rewardPromptGreen from './images/rewardPromptGreen.png';
import rewardPromptStar1 from './images/rewardPromptStar1.png';
import rewardPromptStar2 from './images/rewardPromptStar2.png';

export default function () {
    return {
        restrict: 'E',
        scope: {
            showNum:'@'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
            $scope.rewardPromptBg = rewardPromptBg;
            $scope.rewardPromptC1 = rewardPromptC1;
            $scope.rewardPromptButn = rewardPromptButn;
            $scope.rewardPromptGreen = rewardPromptGreen;
            $scope.rewardPromptStar1 = rewardPromptStar1;
            $scope.rewardPromptStar2 = rewardPromptStar2;

            $scope.hideRewardPrompt = function () {
                $rootScope.showWinterCampRewardPrompt = false;
                $rootScope.alertPopupFlag = false;

            }
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}