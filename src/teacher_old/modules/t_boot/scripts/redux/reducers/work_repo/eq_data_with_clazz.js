import * as default_states from './../../default_states/index';
import {
    MODIFY_EQ_ERROR_DATA
} from './../../action_typs';
import _assign from 'lodash.assign';
export  default (state=default_states.eq_data_with_clazz,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case MODIFY_EQ_ERROR_DATA:
            newState[action.payload.key]= action.payload.data;
            return newState;

        default:
            return state;
    }

};

