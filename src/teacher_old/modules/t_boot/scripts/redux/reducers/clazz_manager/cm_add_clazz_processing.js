/**
 * Created by WangLu on 2016/10/11.
 */
import * as default_states from './../../default_states/index';

import {
    ADD_CLAZZ_START
    ,ADD_CLAZZ_SUCCESS
    ,ADD_CLAZZ_FAIL
} from './../../action_typs';

export  default (state = default_states.cm_add_clazz_processing, action = null)=> {
    switch (action.type) {
        case ADD_CLAZZ_START:
            return true;
        case ADD_CLAZZ_SUCCESS:
        case ADD_CLAZZ_FAIL:
            return false;
        default:
            return state;
    }
};