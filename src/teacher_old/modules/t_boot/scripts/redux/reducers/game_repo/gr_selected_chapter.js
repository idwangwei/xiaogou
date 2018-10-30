/**
 * Created by 彭建伦 on 2016/8/2.
 */
import * as default_states from './../../default_states/index';
import {SELECT_CHAPTER} from "./../../action_typs/index";
let gr_selected_chapter = (state = default_states.gr_selected_chapter, action=null)=> {
    switch (action.type) {
        case SELECT_CHAPTER:
            return action.payload;
        default:
            return state;
    }
};
export  default gr_selected_chapter;