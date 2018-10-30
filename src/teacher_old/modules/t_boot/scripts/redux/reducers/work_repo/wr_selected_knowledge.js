import * as default_states from './../../default_states/index';
import {
    SELECT_KNOWLEDGE
} from './../../action_typs';
import _assign from 'lodash.assign';
let wr_selected_knowledge=(state=default_states.wr_selected_knowledge,action=null)=>{
    switch (action.type) {
        case SELECT_KNOWLEDGE:
            return action.payload;
        default:
            return state;
    }

};

export  default wr_selected_knowledge;