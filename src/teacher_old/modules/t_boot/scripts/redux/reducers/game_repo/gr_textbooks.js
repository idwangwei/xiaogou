import * as default_states from './../../default_states/index';
import {FETCH_GR_TEXTBOOK_LIST_SUCCESS} from "./../../action_typs/index";
let gr_textbooks = (state = default_states.gr_textbooks, action=null)=> {
    switch (action.type) {
        case FETCH_GR_TEXTBOOK_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export  default gr_textbooks;