/**
 * Created by WangLu on 2016/10/19.
 */
import * as default_states from './../../default_states/index';
import {SET_ADD_CLAZZ_STATUS} from './../../action_typs';

export  default (state = default_states.cm_add_clazz_status, action = null)=> {
    switch (action.type) {
        case SET_ADD_CLAZZ_STATUS:
            return action.payload;
        default:
            return state;
    }
};
