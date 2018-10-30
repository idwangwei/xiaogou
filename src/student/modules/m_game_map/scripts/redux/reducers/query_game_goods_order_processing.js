/**
 * Created by WL on 2017/6/29.
 */
import * as default_states from '../default_states/index';

import {GAME_GOODS_PAY} from '../action_types';

export default (state = default_states.query_game_goods_order_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_START:
            return true;
        case GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_SUCCESS:
        case GAME_GOODS_PAY.GAME_GOODS_QUERY_ORDER_INFO_FAIL:
            return false;
        default:
            return state;
    }
};