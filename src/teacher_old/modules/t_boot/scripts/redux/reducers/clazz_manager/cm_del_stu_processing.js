/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_states from './../../default_states/index';

import {
     DELETE_STUDENT_START
    ,DELETE_STUDENT_SUCCESS
    ,DELETE_STUDENT_FAIL
} from './../../action_typs';

export  default (state = default_states.cm_del_stu_processing, action = null)=> {
    switch (action.type) {
        case DELETE_STUDENT_START:
            return true;
        case DELETE_STUDENT_SUCCESS:
        case DELETE_STUDENT_FAIL:
            return false;
        default:
            return state;
    }
};