import * as default_states from './../../default_states/index';
import {
    SELECT_WORK_CLAZZ
} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state=default_states.wl_selected_clazz,action=null)=>{
    switch (action.type) {
        case SELECT_WORK_CLAZZ:
            let newState = _assign({},state);
            newState = action.payload;
            return newState;
        default:
            return state;
    }

};
