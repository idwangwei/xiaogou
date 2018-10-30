import * as default_states from './../../default_states/index';
import {
     FETCH_PAPER_CRITERIA_START
    ,FETCH_PAPER_CRITERIA_SUCCESS
    ,FETCH_PAPER_CRITERIA_FAIL} from './../../action_typs'


let wr_fetch_paper_criteria_processing=(state=default_states.wr_fetch_paper_criteria_processing,action=null)=>{
    switch (action.type) {
        case FETCH_PAPER_CRITERIA_START:
            return true;
        case FETCH_PAPER_CRITERIA_SUCCESS:
        case FETCH_PAPER_CRITERIA_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_fetch_paper_criteria_processing;