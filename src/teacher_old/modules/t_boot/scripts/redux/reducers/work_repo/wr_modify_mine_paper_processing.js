import * as default_states from './../../default_states/index';
import {
     MODIFY_MINE_PAPER_START
    ,MODIFY_MINE_PAPER_SUCCESS
    ,MODIFY_MINE_PAPER_FAIL
} from './../../action_typs';

let wr_modify_mine_paper_processing=(state=default_states.wr_modify_mine_paper_processing,action=null)=>{
    switch (action.type) {
        case MODIFY_MINE_PAPER_START:
            return true;
        case MODIFY_MINE_PAPER_SUCCESS:
        case MODIFY_MINE_PAPER_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_modify_mine_paper_processing;