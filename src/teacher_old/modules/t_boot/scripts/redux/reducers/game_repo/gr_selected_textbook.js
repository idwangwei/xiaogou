import * as default_states from './../../default_states/index';
import {SELECT_TEXTBOOK_GAME} from "./../../action_typs/index";
let gr_selected_textbook = (state = default_states.gr_selected_textbook, action=null)=> {
    switch (action.type) {
        case SELECT_TEXTBOOK_GAME:
            return action.payload;
        default:
            return state;
    }
};
export  default gr_selected_textbook;