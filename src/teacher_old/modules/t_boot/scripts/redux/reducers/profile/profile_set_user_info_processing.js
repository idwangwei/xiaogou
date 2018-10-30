/**
 * Created by zl on 2016/9/30.
 */
import * as default_states from './../../default_states/index';

import {
    MODIFY_TEACHER_BASE_INFO_START
    , MODIFY_TEACHER_BASE_INFO_SUCCESS
    , MODIFY_TEACHER_BASE_INFO_FAIL
} from './../../action_typs';

export  default (state = default_states.profile_set_user_info_processing, action = null)=> {
    switch (action.type) {
        case MODIFY_TEACHER_BASE_INFO_START:
            return true;
        case MODIFY_TEACHER_BASE_INFO_SUCCESS:
        case MODIFY_TEACHER_BASE_INFO_FAIL:
            return false;
        default:
            return state;
    }
};
