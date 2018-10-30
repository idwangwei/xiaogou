import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import {
    SELECT_DETAIL_PAPER
    ,SELECT_EDIT_PAPER
} from './../../action_typs';


let wr_selected_paper = (state = default_states.wr_selected_paper, action = null)=> {
    let payload = action.payload;
    let newState = _assign({}, state);
    switch (action.type) {
        case SELECT_DETAIL_PAPER:
        case SELECT_EDIT_PAPER:
            newState = payload||{};
            return newState;

        default:
            return state;
    }
};

export  default wr_selected_paper;