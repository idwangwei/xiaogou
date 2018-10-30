/**
 * Created by Administrator on 2017/5/10.
 */
import {REWARD_INFO} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
export default (state = defaultStates.update_user_reward_base_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case REWARD_INFO.UPDATE_USER_REWARD_BASE_START:
            return true;
        case REWARD_INFO.UPDATE_USER_REWARD_BASE_SUCCESS:
            return false;
        case REWARD_INFO.UPDATE_USER_REWARD_BASE_FAIL:
            return false;
        default:
            return false

    }
};