/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_states from './../../default_states/index';

import {
     FETCH_STUDENT_DETAIL_START
    ,FETCH_STUDENT_DETAIL_SUCCESS
    ,FETCH_STUDENT_DETAIL_FAIL
} from './../../action_typs';

export  default (state = default_states.cm_fetch_stu_detail_processing, action = null)=> {
    switch (action.type) {
        case FETCH_STUDENT_DETAIL_START:
            return true;
        case FETCH_STUDENT_DETAIL_SUCCESS:
        case FETCH_STUDENT_DETAIL_FAIL:
            return false;
        default:
            return state;
    }
};