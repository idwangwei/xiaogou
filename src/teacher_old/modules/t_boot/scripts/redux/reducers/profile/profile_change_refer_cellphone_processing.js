/**
 * Created by zl on 2016/9/30.
 */
import * as default_states from './../../default_states/index';

import {
    CHANGE_TEACHER_RELEVANCE_CELLPHONE_START
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE_SUCCESS
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE_FAIL
} from './../../action_typs';

export  default (state = default_states.profile_change_refer_cellphone_processing, action = null)=> {
    switch (action.type) {
        case CHANGE_TEACHER_RELEVANCE_CELLPHONE_START:
            return true;
        case CHANGE_TEACHER_RELEVANCE_CELLPHONE_SUCCESS:
        case CHANGE_TEACHER_RELEVANCE_CELLPHONE_FAIL:
            return false;
        default:
            return state;
    }
};
