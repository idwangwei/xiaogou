import * as default_states from './../../default_states/index';
import {
    SET_WORK_LIST_PAGE_INFO
} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state=default_states.wl_page_info,action=null)=>{
    switch (action.type) {
        case SET_WORK_LIST_PAGE_INFO:
            let newState = _assign({},state);
            newState.lastKey = action.payload;
            // newState.quantity = action.payload;
            return newState;
        default:
            return state;
    }

};
