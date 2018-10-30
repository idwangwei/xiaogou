/**
 * Created by ZL on 2018/1/3.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import rewardReducers from './redux/index';
import * as defaultStates from './redux/default_states/index';


let m_reward = angular.module('m_reward', [
    'm_reward.services',
    'm_reward.directives',
    'm_reward.constants'
]);
registerModule(m_reward,rewardReducers,defaultStates);
m_reward.run(['$rootScope','$ngRedux',($root,$ngRedux)=>{
    /*$root.loadRewardImg = (imgUrl)=>{
        return require('../reward_images/' + imgUrl);
    };*/
    $root.$on('$stateChangeSuccess', function (ev, toState) {
        if(toState.name === 'system_login'){
            $root.hasShowSignInPopup = false;
        }
    });
}]);
export {m_reward};
export * from 'ngDecoratorForStudent/ng-decorator';