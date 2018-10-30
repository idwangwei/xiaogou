import * as default_states from './../default_states/index';
import {
    SELECT_AREA_EVALUATION_TEXTBOOK_WORK
} from './../action_types';
import _assign from 'lodash.assign';
let wr_selected_textbook=(state=default_states.ae_selected_textbook,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case SELECT_AREA_EVALUATION_TEXTBOOK_WORK:
            newState[action.payload.clazzId] = action.payload.textbook;
            return newState;
        default:
            return state;
    }

};

export  default wr_selected_textbook;