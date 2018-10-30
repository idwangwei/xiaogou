import * as default_states from './../../default_states/index';
import {
    SELECT_MATH_OLY_CLAZZ
} from './../../action_typs';
import _assign from 'lodash.assign';


export  default (state=default_states.mo_selected_clazz,action=null)=>{
    let nextState = _assign({},state);
    switch (action.type) {
        case SELECT_MATH_OLY_CLAZZ:
            return nextState = action.payload;
        default:
            return state;
    }

};
