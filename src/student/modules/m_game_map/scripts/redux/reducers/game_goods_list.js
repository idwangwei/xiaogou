/**
 * Created by ZL on 2017/6/23.
 */
import * as default_states from '../default_states/index';

import {GAME_GOODS_PAY} from '../action_types';

export default (state = default_states.game_goods_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case GAME_GOODS_PAY.FETCH_GOODS_LIST_SUCCESS:
            // nextState = Object.assign(nextState, action.payload);
            nextState = action.payload;
            return nextState;
        case GAME_GOODS_PAY.FETCH_GOODS_LIST_START:
        case GAME_GOODS_PAY.FETCH_GOODS_LIST_FAIL:
        default:
            return nextState;
    }
};