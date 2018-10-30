import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';
import {FETCH_PAPER_CRITERIA_SUCCESS} from './../../action_typs'


let wr_gen_paper_criteria=(state=default_states.wr_gen_paper_criteria,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case FETCH_PAPER_CRITERIA_SUCCESS:
            newState.criteriaList = action.payload;
            return newState;
        default:
            return state;
    }
};

export  default wr_gen_paper_criteria;