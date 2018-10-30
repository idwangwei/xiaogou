/**
 * Created by ZL on 2017/6/23.
 */

import * as default_states from '../default_states/index';

import {GAME_GOODS_PAY} from '../action_types';

export default (state = default_states.fetch_goods_list_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case GAME_GOODS_PAY.FETCH_GOODS_LIST_START:
            return true;
        case GAME_GOODS_PAY.FETCH_GOODS_LIST_SUCCESS:
        case GAME_GOODS_PAY.FETCH_GOODS_LIST_FAIL:
            return false;
        default:
            return state;
    }
};