import * as default_states from './../default_states/index';
import {
    FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_START
    ,FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS
    ,FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL} from './../action_types'


let wr_fetch_textbook_processing=(state=default_states.ae_fetch_textbook_processing,action=null)=>{
    switch (action.type) {
        case FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_START:
            return true;
        case FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS:
        case FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_fetch_textbook_processing;