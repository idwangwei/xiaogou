import * as default_states from './../../default_states/index';

import {FETCH_WR_TEXTBOOK_LIST_SUCCESS} from './../../action_typs'


let wr_textbooks=(state=default_states.wr_textbooks,action=null)=>{

    switch (action.type) {
        case FETCH_WR_TEXTBOOK_LIST_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};

export  default wr_textbooks;