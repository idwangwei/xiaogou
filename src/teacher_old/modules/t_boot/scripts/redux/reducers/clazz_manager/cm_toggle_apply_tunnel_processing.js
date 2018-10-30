/**
 * Created by WangLu on 2016/9/30.
 */
import * as default_states from './../../default_states/index';

import {
    TOGGLE_CLAZZ_APPLY_TUNNEL_START
    ,TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS
    ,TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL
} from './../../action_typs';

export  default (state = default_states.cm_toggle_apply_tunnel_processing, action = null)=> {
    switch (action.type) {
        case TOGGLE_CLAZZ_APPLY_TUNNEL_START:
            return true;
        case TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS:
        case TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL:
            return false;
        default:
            return state;
    }
};