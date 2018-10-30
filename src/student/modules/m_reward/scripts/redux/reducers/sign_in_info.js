/**
 * Created by Administrator on 2017/5/5.
 */
import * as default_states from '../default_states/index';

import {FETCH_SIGN_INFO} from '../action_types';

export default (state = default_states.sign_in_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_SIGN_INFO:
            return action.payload;
        default:
            return state;
    }
};