import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import {
     FETCH_PAPER_DETAIL_START
    ,FETCH_PAPER_DETAIL_SUCCESS
    ,FETCH_PAPER_DETAIL_FAIL
} from './../../action_typs';


let wr_fetch_paper_processing=(state=default_states.wr_fetch_paper_processing,action=null)=>{
    switch (action.type) {
        case FETCH_PAPER_DETAIL_START:
            return true;
        case FETCH_PAPER_DETAIL_SUCCESS:
        case FETCH_PAPER_DETAIL_FAIL:
            return false;

        default:
            return state;
    }
};

export  default wr_fetch_paper_processing;