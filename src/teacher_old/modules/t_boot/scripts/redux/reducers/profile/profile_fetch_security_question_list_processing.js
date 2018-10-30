/**
 * Created by zl on 2016/9/30.
 */
import * as default_states from './../../default_states/index';

import {
    FETCH_SECURITY_QUESTION_LIST_START
    , FETCH_SECURITY_QUESTION_LIST_SUCCESS
    , FETCH_SECURITY_QUESTION_LIST_FAIL
} from './../../action_typs';

export  default (state = default_states.profile_fetch_security_question_list_processing, action = null)=> {
    switch (action.type) {
        case FETCH_SECURITY_QUESTION_LIST_START:
            return true;
        case FETCH_SECURITY_QUESTION_LIST_SUCCESS:
        case FETCH_SECURITY_QUESTION_LIST_FAIL:
            return false;
        default:
            return state;
    }
};