/**
 * Created by WangLu on 2016/10/13.
 */
import * as default_state from './../../default_states/index';
import {
    FETCH_ADDING_STU_LIST_START
    ,FETCH_ADDING_STU_LIST_SUCCESS
    ,FETCH_ADDING_STU_LIST_FAIL
}from './../../action_typs';

export default (state=default_state.cm_fetch_adding_stu_list_processing,action= null)=>{
    switch (action.type){
        case FETCH_ADDING_STU_LIST_START:
            return true;
        case FETCH_ADDING_STU_LIST_SUCCESS:
        case FETCH_ADDING_STU_LIST_FAIL:
            return false;
        default :
            return state;
    }
}