import * as default_states from './../../default_states/index';

import {
    FETCH_TEXTBOOK_CHAPTER_START
    ,FETCH_TEXTBOOK_CHAPTER_SUCCESS
    ,FETCH_TEXTBOOK_CHAPTER_FAIL
} from './../../action_typs';

let wr_fetch_chapter_processing = (state = default_states.wr_fetch_chapter_processing, action = null)=> {
    switch (action.type) {
        case FETCH_TEXTBOOK_CHAPTER_START:
            return true;
        case FETCH_TEXTBOOK_CHAPTER_SUCCESS:
        case FETCH_TEXTBOOK_CHAPTER_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_fetch_chapter_processing;