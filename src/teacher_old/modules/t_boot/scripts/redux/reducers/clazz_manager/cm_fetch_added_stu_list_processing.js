/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_status from './../../default_states/index';
import {
    FETCH_ADDED_STU_LIST_START
    ,FETCH_ADDED_STU_LIST_SUCCESS
    ,FETCH_ADDED_STU_LIST_FAIL
} from './../../action_typs';

export default (state = default_status.cm_fetch_added_stu_list_processing, action = null)=>{
    switch (action.type){
        case FETCH_ADDED_STU_LIST_START:
            return false;
        case FETCH_ADDED_STU_LIST_SUCCESS:
        case FETCH_ADDED_STU_LIST_FAIL:
            return true;
        default:
            return state;
    }
}