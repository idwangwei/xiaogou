/**
 * Created by qiyuexi on 2017/12/8.
 */
import * as default_states from '../default_states/index';

import {FIRST_COME_IN} from '../action_types';

export default (state = default_states.first_come_in, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FIRST_COME_IN:
            return action.payload;
        default:
            return state;
    }
};