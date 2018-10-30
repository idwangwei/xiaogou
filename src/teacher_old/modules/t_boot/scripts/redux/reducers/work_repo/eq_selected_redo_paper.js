import * as default_states from './../../default_states/index';
import {
    EQ_SELECTED_REDO_PAPER
} from './../../action_typs';
import _assign from 'lodash.assign';
export  default (state=default_states.eq_selected_redo_paper,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case EQ_SELECTED_REDO_PAPER:
            newState[action.payload.clazzId] = action.payload.paper;
            return newState;
        default:
            return state;
    }

};

