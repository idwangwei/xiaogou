import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import _findindex from 'lodash.findindex';
import {
     FETCH_WORK_LIST_SUCCESS
    ,FETCH_WORK_LIST_FAIL
    ,ADD_ARCHIVED_WORK
    ,FETCH_STUDENT_LIST_SUCCESS
    ,FETCH_WORK_DATA_SUCCESS
    ,DELETE_WORK_ITEM
} from './../../action_typs';
export  default (state=default_states.wl_clazz_list_with_work,action=null)=>{
    let newState = _assign({},state);
    let payload = action.payload, index;
    switch (action.type) {
        case FETCH_WORK_LIST_SUCCESS:
            if(payload.isLoadMore){
                newState[payload.clazzId] = newState[payload.clazzId].concat(payload.workList);
            }
            else {
                newState[payload.clazzId] = payload.workList;
            }
            return newState;
        case DELETE_WORK_ITEM:
        case ADD_ARCHIVED_WORK:
            index = _findindex(newState[payload.clazzId],{instanceId:payload.instanceId});
            if(index != -1){
                newState[payload.clazzId].splice(index,1);
            }

            return newState;


        case FETCH_WORK_LIST_FAIL:
        default:
            return state;
    }

};
