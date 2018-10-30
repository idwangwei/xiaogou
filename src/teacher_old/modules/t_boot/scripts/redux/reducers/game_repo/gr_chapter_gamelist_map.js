import * as default_states from './../../default_states/index';
import {FETCH_CHAPTER_GAME_LIST_SUCCESS} from "./../../action_typs/index";
let gr_chapter_gamelist_map = (state = default_states.gr_chapter_gamelist_map, action=null)=> {
    switch (action.type) {
        case FETCH_CHAPTER_GAME_LIST_SUCCESS:
            let id = action.payload.id;
            let list = action.payload.list;
            return Object.assign({}, {[id]: list});
        default:
            return state;
    }
};

export  default gr_chapter_gamelist_map;