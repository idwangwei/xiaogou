import * as default_states from './../../default_states/index';
import {
    SELECT_TEXTBOOK_WORK
    ,FETCH_TEXTBOOK_CHAPTER_SUCCESS
} from './../../action_typs';
import _assign from 'lodash.assign';
let wr_selected_textbook=(state=default_states.wr_selected_textbook,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case SELECT_TEXTBOOK_WORK:
            newState[action.payload.clazzId] = action.payload.textbook;
            return newState;
        //case FETCH_TEXTBOOK_CHAPTER_SUCCESS:
        //    newState.chapter = action.payload;
        //    return newState;

        default:
            return state;
    }

};

export  default wr_selected_textbook;