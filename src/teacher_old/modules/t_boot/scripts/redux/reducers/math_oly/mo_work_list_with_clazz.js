import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import _findindex from 'lodash.findindex';

import {
     FETCH_MATH_OLY_WORK_LIST_SUCCESS
    ,DELETE_MATH_OLY_WORK
} from './../../action_typs';
export  default (state=default_states.mo_work_list_with_clazz,action=null)=>{
    let newState = _assign({},state);
    let payload = action.payload;
    switch (action.type) {
        case FETCH_MATH_OLY_WORK_LIST_SUCCESS:
            if(payload.isLoadMore){
                newState[payload.clazzId] = newState[payload.clazzId].concat(payload.workList);
            }
            else {
                newState[payload.clazzId] = payload.workList;
            }
            return newState;
        case DELETE_MATH_OLY_WORK:
            if(!newState[payload.clazzId]){return state}

            let index = _findindex(newState[payload.clazzId],{instanceId:payload.instanceId});
            if(index != -1){newState[payload.clazzId].splice(index,1)}
            return newState;

            return newState;
        default:
            return state;
    }

};
