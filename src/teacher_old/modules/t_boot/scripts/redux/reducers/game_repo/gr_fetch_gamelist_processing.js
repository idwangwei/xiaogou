import * as default_states from './../../default_states/index';
import {FETCH_CHAPTER_GAME_LIST_START, FETCH_CHAPTER_GAME_LIST_FAIL} from './../../action_typs/index';
let gr_fetch_gamelist_processing = (state = default_states.gr_fetch_game_processing, action = null)=> {
    switch (action.type) {
        case FETCH_CHAPTER_GAME_LIST_START :
            return true;
        case FETCH_CHAPTER_GAME_LIST_FAIL:
            return false;
        default:
            return state;
    }
};

export  default gr_fetch_gamelist_processing;