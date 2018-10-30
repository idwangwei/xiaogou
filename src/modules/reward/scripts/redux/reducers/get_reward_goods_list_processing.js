/**
 * Created by Administrator on 2017/5/11.
 */
import * as default_states from '../default_states/index';

import {
    FETCH_REWARD_GOODS_LIST_START,
    FETCH_REWARD_GOODS_LIST_SUCCESS,
    FETCH_REWARD_GOODS_LIST_FAIL
} from '../action_types';

export default (state = default_states.get_reward_goods_list_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_REWARD_GOODS_LIST_START:
            return true;
        case FETCH_REWARD_GOODS_LIST_SUCCESS:
            return false;
        case FETCH_REWARD_GOODS_LIST_FAIL:
            return false;
        default:
            return state;
    }
};