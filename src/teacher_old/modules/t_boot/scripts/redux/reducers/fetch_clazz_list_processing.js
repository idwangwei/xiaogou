import * as default_states from './../default_states/index';

import {
     FETCH_CLAZZ_LIST_START
    ,FETCH_CLAZZ_LIST_SUCCESS
    ,FETCH_CLAZZ_LIST_FAIL
} from './../action_typs';

export  default (state = default_states.fetch_clazz_list_processing, action = null)=> {
    switch (action.type) {
        case FETCH_CLAZZ_LIST_START:
            return true;
        case FETCH_CLAZZ_LIST_SUCCESS:
        case FETCH_CLAZZ_LIST_FAIL:
            return false;
        default:
            return state;
    }
};
