/**
 * Created by ZL on 2017/6/13.
 */
import './style.less';
import rewardPromptBg from '../../../reward_images/rewardPrompt/rewardPromptBg.png';
import rewardPromptC1 from '../../../reward_images/rewardPrompt/rewardPromptContent1.png';
import rewardPromptC2 from '../../../reward_images/rewardPrompt/rewardPromptContent2.png';
import rewardPromptButn from '../../../reward_images/rewardPrompt/rewardPromptButn.png';
import rewardPromptGreen from '../../../reward_images/rewardPrompt/rewardPromptGreen.png';
import rewardPromptStar1 from '../../../reward_images/rewardPrompt/rewardPromptStar1.png';
import rewardPromptStar2 from '../../../reward_images/rewardPrompt/rewardPromptStar2.png';

export default function () {
    return {
        restrict: 'E',
        scope: {
            type:'@',
            showNum:'@'
        },
        replace: false,
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
            $scope.rewardPromptBg = rewardPromptBg;
            $scope.rewardPromptC1 = rewardPromptC1;
            $scope.rewardPromptC2 = rewardPromptC2;
            $scope.rewardPromptButn = rewardPromptButn;
            $scope.rewardPromptGreen = rewardPromptGreen;
            $scope.rewardPromptStar1 = rewardPromptStar1;
            $scope.rewardPromptStar2 = rewardPromptStar2;

            $scope.hideRewardPrompt = function () {
                $rootScope.showRewardPrompt = false;
                $rootScope.alertPopupFlag = false;

            }
        }],
        link: function ($scope, $element, $attrs) {

        }
    };
}