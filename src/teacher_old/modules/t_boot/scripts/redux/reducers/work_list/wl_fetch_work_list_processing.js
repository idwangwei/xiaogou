import * as default_states from './../../default_states/index';

import {
     FETCH_WORK_LIST_START
    ,FETCH_WORK_LIST_SUCCESS
    ,FETCH_WORK_LIST_FAIL
} from './../../action_typs';

export  default (state = default_states.wl_fetch_work_list_processing, action = null)=> {
    switch (action.type) {
        case FETCH_WORK_LIST_START:
            return true;
        case FETCH_WORK_LIST_SUCCESS:
        case FETCH_WORK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};
