/**
 * Created by zl on 2016/9/30.
 */
import * as default_states from './../../default_states/index';

import {
    SET_SECURITY_ANSWER_START
    , SET_SECURITY_ANSWER_SUCCESS
    , SET_SECURITY_ANSWER_FAIL
} from './../../action_typs';

export  default (state = default_states.profile_change_security_info_processing, action = null)=> {
    switch (action.type) {
        case SET_SECURITY_ANSWER_START:
            return true;
        case SET_SECURITY_ANSWER_SUCCESS:
        case SET_SECURITY_ANSWER_FAIL:
            return false;
        default:
            return state;
    }
};
