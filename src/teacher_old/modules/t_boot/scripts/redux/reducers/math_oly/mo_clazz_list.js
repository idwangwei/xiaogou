import * as default_states from './../../default_states/index';
import {
    FETCH_CLAZZ_LIST_SUCCESS
} from './../../action_typs';
import _assign from 'lodash.assign';


export  default (state = default_states.mo_clazz_list, action=null)=>{
    let nextState = _assign({},state);
    switch (action.type) {
        case FETCH_CLAZZ_LIST_SUCCESS:
            return nextState = action.payload.omClazzList;
        default:
            return state;
    }

};
