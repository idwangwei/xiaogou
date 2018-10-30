import * as default_states from './../../default_states/index';
import {
    EQ_SELECT_CONDITION
} from './../../action_typs';
import _assign from 'lodash.assign';
export  default (state=default_states.eq_selected_condition,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case EQ_SELECT_CONDITION:
            newState[action.payload.clazzId] = action.payload.condition;
            return newState;
        default:
            return state;
    }

};

