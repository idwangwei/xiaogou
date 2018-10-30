import * as default_states from './../default_states/index';

import {FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS} from './../action_types'


let wr_textbooks=(state=default_states.ae_textbooks,action=null)=>{

    switch (action.type) {
        case FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};

export  default wr_textbooks;