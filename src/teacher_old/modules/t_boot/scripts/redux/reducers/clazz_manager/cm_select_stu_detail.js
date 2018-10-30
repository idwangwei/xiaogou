/**
 * Created by WangLu on 2016/10/17.
 */
import * as default_states from './../../default_states/index';

import {
    FETCH_STUDENT_DETAIL_START
    ,FETCH_STUDENT_DETAIL_SUCCESS
    ,FETCH_STUDENT_DETAIL_FAIL
} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state = default_states.cm_select_stu_detail, action = null)=> {
    let nextState = _assign({},state);
    switch (action.type) {
        case FETCH_STUDENT_DETAIL_SUCCESS:
            nextState.student = action.payload.student;
            nextState.parent = action.payload.parent;
            return nextState;
        case FETCH_STUDENT_DETAIL_START:
        case FETCH_STUDENT_DETAIL_FAIL:
            return state;
        default:
            return state;
    }
};