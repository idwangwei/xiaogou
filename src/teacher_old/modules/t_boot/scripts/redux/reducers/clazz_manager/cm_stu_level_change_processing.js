/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_states from './../../default_states/index';

import {
     CHANGE_STU_LEVEL_START 
    ,CHANGE_STU_LEVEL_SUCCESS 
    ,CHANGE_STU_LEVEL_FAIL 
} from './../../action_typs';

export  default (state = default_states.cm_stu_level_change_processing, action = null)=> {
    switch (action.type) {
        case CHANGE_STU_LEVEL_START:
            return true;
        case CHANGE_STU_LEVEL_SUCCESS:
        case CHANGE_STU_LEVEL_FAIL:
            return false;
        default:
            return state;
    }
};