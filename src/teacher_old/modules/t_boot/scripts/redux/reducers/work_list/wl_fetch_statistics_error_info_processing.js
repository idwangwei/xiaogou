import * as default_states from './../../default_states/index';

import {
     FETCH_STATISTICS_ERROR_INFO_START
    ,FETCH_STATISTICS_ERROR_INFO_SUCCESS
    ,FETCH_STATISTICS_ERROR_INFO_FAIL
} from './../../action_typs';

export  default (state = default_states.wl_fetch_work_list_processing, action = null)=> {
    switch (action.type) {
        case FETCH_STATISTICS_ERROR_INFO_START:
            return true;
        case FETCH_STATISTICS_ERROR_INFO_SUCCESS:
        case FETCH_STATISTICS_ERROR_INFO_FAIL:
            return false;
        default:
            return state;
    }
};
