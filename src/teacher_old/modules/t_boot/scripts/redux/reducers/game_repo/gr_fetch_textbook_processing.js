import * as default_states from './../../default_states/index';
import {
    FETCH_TEXTBOOK_DETAIL_START,
    FETCH_TEXTBOOK_DETAIL_SUCCESS,
    FETCH_TEXTBOOK_LIST_FAIL
} from "./../../action_typs/index";
let gr_fetch_textbook_processing = (state = default_states.gr_fetch_textbook_processing, action = null)=> {
    switch (action.type) {
        case FETCH_TEXTBOOK_DETAIL_START:
            return true;
        case FETCH_TEXTBOOK_DETAIL_SUCCESS || FETCH_TEXTBOOK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};

export  default gr_fetch_textbook_processing;