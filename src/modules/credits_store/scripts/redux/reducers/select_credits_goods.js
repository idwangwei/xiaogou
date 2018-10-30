/**
 * Created by ZL on 2017/11/10.
 */
import * as default_states from '../default_states/index';

import {CREDITS_GOODS} from '../action_types';

export default (state = default_states.select_credits_goods, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case CREDITS_GOODS.SELECT_CREDITS_GOODS:
            return action.payload;
        default:
            return state;
    }
};