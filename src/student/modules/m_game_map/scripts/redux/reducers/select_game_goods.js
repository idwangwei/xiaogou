/**
 * Created by ZL on 2017/6/23.
 */
import * as default_states from '../default_states/index';

import {GAME_GOODS_PAY} from '../action_types';

export default (state = default_states.select_game_goods, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case GAME_GOODS_PAY.SELECT_GAME_GOODS_INFO:
            nextState = action.payload;
            return nextState;
        default:
            return nextState;
    }
};