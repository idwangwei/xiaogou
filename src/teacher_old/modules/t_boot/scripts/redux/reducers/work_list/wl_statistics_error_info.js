import * as default_states from './../../default_states/index';
import {
    MODIFY_STATISTICS_ERROR_INFO
} from './../../action_typs';

export  default (state=default_states.wl_statistics_error_info,action=null)=>{
    switch (action.type) {
        case MODIFY_STATISTICS_ERROR_INFO:
            return action.payload;
        default:
            return state;
    }

};
