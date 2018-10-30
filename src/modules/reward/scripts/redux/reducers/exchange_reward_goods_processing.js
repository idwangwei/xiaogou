/**
 * Created by Administrator on 2017/5/11.
 */
import * as default_states from '../default_states/index';

import {
    EXCHANGE_REWARD_GOODS_START,
    EXCHANGE_REWARD_GOODS_SUCCESS,
    EXCHANGE_REWARD_GOODS_FAIL
} from '../action_types';

export default (state = default_states.exchange_reward_goods_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case EXCHANGE_REWARD_GOODS_START:
            return true;
        case EXCHANGE_REWARD_GOODS_SUCCESS:
            return false;
        case EXCHANGE_REWARD_GOODS_FAIL:
            return false;
        default:
            return state;
    }
};