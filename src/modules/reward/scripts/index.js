/**
 * Created by Administrator on 2017/5/3.
 */
import 'ngDecorator/decoratorModule';

import './pages/index';
import './services/index';
import rewardReducers from './redux/index';
import './directives/index';
import "./constants/index";
import "./constants/constant";

let rewardModule = angular.module('reward', [
    'reward.controllers',
    'reward.services',
    'ngDecModule',
    'reward.directives',
    'reward.constants'
]);
rewardModule.run(['$rootScope',($root)=>{
    $root.loadRewardImg = (imgUrl)=>{
        return require('../reward_images/' + imgUrl);
    };

    $root.$on('$stateChangeSuccess', function (ev, toState) {
        if(toState.name === 'system_login'){
            $root.hasShowSignInPopup = false;
        }
    });
}]);
export {rewardModule,rewardReducers}

