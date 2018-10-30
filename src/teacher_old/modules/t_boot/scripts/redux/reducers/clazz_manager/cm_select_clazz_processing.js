/**
 * Created by WangLu on 2016/9/30.
 */
import * as default_states from './../../default_states/index';

import {
    CHANGE_SELECT_CLAZZ_DETAIL_START
    ,CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS
    ,CHANGE_SELECT_CLAZZ_DETAIL_FAIL
} from './../../action_typs';

export  default (state = default_states.cm_select_clazz_processing, action = null)=> {
    switch (action.type) {
        case CHANGE_SELECT_CLAZZ_DETAIL_START:
            return true;
        case CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS:
        case CHANGE_SELECT_CLAZZ_DETAIL_FAIL:
            return false;
        default:
            return state;
    }
};