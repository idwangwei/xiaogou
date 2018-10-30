/**
 * Created by Administrator on 2017/5/8.
 */
import * as default_states from '../default_states/index';

import {FETCH_REWARD_INFO_START,
    FETCH_REWARD_INFO_SUCCESS,
    FETCH_REWARD_INFO_FAIL} from '../action_types';

export default (state = default_states.fetch_reward_info_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_REWARD_INFO_START:
            return true;
        case FETCH_REWARD_INFO_SUCCESS:
            return false;
        case FETCH_REWARD_INFO_FAIL:
            return false;
        default:
            return state;
    }
};