import * as default_states from './../../default_states/index';
import {
     FETCH_PAPER_LIST_START
    ,FETCH_PAPER_LIST_SUCCESS
    ,FETCH_PAPER_LIST_FAIL
} from './../../action_typs';

let wr_fetch_paperlist_processing=(state=default_states.wr_fetch_paperlist_processing,action=null)=>{
    switch (action.type) {
        case FETCH_PAPER_LIST_START:
            return true;
        case FETCH_PAPER_LIST_SUCCESS:
        case FETCH_PAPER_LIST_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_fetch_paperlist_processing;