import * as default_states from './../../default_states/index';
import {
    FETCH_TEXTBOOK_DETAIL_SUCCESS
    ,FETCH_TEXTBOOK_DETAIL_FAIL
    ,RESET_FETCH_TEXTBOOK_DETAIL
} from "./../../action_typs/index";
let gr_textbook_detail_map = (state = default_states.gr_textbook_detail_map, action=null)=> {
    let payload = action.payload;
    switch (action.type) {
        case FETCH_TEXTBOOK_DETAIL_SUCCESS:
            let detail = action.payload.data;
            return Object.assign({}, {[payload.id]:detail});
        case FETCH_TEXTBOOK_DETAIL_FAIL:
            return Object.assign({}, {[payload.id]:[]});
        case RESET_FETCH_TEXTBOOK_DETAIL:
            return Object.assign({}, {[payload.id]:[]});
        default:
            return state;
    }
};
export  default gr_textbook_detail_map;