import * as default_states from './../../default_states/index';
import _findIndex from 'lodash.findindex';
import {
    MODIFY_EQ_ERROR_PAPER
} from './../../action_typs';
import _assign from 'lodash.assign';
export  default (state=default_states.eq_paper_with_clazz,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case MODIFY_EQ_ERROR_PAPER:
            if(action.payload.isMore){
                newState[action.payload.key] = newState[action.payload.key].concat(action.payload.list);
            }else if(action.payload.remove){
                newState[action.payload.key].splice(_findIndex(newState[action.payload.key],{id:action.payload.paperId}),1);
            }else {
                newState[action.payload.key]= action.payload.list;
            }
            return newState;
        default:
            return state;
    }

};

