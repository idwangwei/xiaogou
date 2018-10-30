/**
 * Created by ZL on 2017/11/10.
 */
import * as default_states from '../default_states/index';

import {
    GET_DEFAULT_RECEIVER_SUCCESS,
} from '../action_types';

export default (state = default_states.default_receiver, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case GET_DEFAULT_RECEIVER_SUCCESS:
            nextState = action.payload;
            return nextState;
        default:
            return state;
    }
};