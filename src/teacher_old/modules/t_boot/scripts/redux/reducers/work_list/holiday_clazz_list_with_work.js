import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import {
     FETCH_HOLIDAY_WORK_LIST_SUCCESS
} from './../../action_typs';
export  default (state=default_states.wl_clazz_list_with_work,action=null)=>{
    let newState = _assign({},state);
    let payload = action.payload;
    switch (action.type) {
        case FETCH_HOLIDAY_WORK_LIST_SUCCESS:
            newState[payload.clazzId] = payload.workList;
            return newState;
        default:
            return state;
    }

};
