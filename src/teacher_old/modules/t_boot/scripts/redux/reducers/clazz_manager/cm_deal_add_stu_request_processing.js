/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_status from './../../default_states/index';
import {
     DEAL_ADD_STU_REQUEST_START
    ,DEAL_ADD_STU_REQUEST_SUCCESS
    ,DEAL_ADD_STU_REQUEST_FAIL
} from './../../action_typs';

export default (state = default_status.cm_deal_add_stu_request_processing, action = null)=> {
    switch (action.type) {
        case DEAL_ADD_STU_REQUEST_START:
            return false;
        case DEAL_ADD_STU_REQUEST_SUCCESS:
        case DEAL_ADD_STU_REQUEST_FAIL:
            return true;
        default:
            return state;
    }
}