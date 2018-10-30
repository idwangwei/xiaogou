import * as default_states from './../../default_states/index';
import {
    FETCH_GR_TEXTBOOK_LIST_START,
    FETCH_GR_TEXTBOOK_LIST_SUCCESS,
    FETCH_GR_TEXTBOOK_LIST_FAIL
} from "./../../action_typs/index";
let gr_fetch_textbooks_processing = (state = default_states.gr_fetch_textbooks_processing, action=null)=> {
    switch (action.type) {
        case FETCH_GR_TEXTBOOK_LIST_START:
            return true;
        case FETCH_GR_TEXTBOOK_LIST_SUCCESS:
            return false;
        case FETCH_GR_TEXTBOOK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};

export  default gr_fetch_textbooks_processing;