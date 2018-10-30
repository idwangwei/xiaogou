/**
 * Created by Administrator on 2017/5/8.
 */
import * as default_states from '../default_states/index';

import {SIGN_INFO_START,
    SIGN_INFO_SUCCESS,
    SIGN_INFO_FAIL} from '../action_types';

export default (state = default_states.sign_in_execute_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case SIGN_INFO_START:
            return true;
        case SIGN_INFO_SUCCESS:
            return false;
        case SIGN_INFO_FAIL:
            return false;
        default:
            return state;
    }
};