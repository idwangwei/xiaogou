3/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_status from './../../default_states/index';
import {
    FETCH_ADDED_STU_LIST_START
    ,FETCH_ADDED_STU_LIST_SUCCESS
    ,FETCH_ADDED_STU_LIST_FAIL
    ,CHANGE_STU_LEVEL_LIST
} from './../../action_typs';
import _assign from 'lodash.assign';

export default (state = default_status.cm_added_stu_list, action = null)=>{
    let nextState = _assign({},state);
    switch (action.type){
        case FETCH_ADDED_STU_LIST_SUCCESS:
        case CHANGE_STU_LEVEL_LIST:
            nextState = action.payload;
            return nextState;
        case FETCH_ADDED_STU_LIST_START:
        case FETCH_ADDED_STU_LIST_FAIL:
            return state;
        default:
            return state;
    }
}