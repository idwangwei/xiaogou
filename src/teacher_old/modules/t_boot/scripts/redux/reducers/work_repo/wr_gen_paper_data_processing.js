import * as default_states from './../../default_states/index';
import {
      GEN_PAPER_DATA_START
     ,GEN_PAPER_DATA_SUCCESS
     ,GEN_PAPER_DATA_FAIL
} from './../../action_typs';

let wr_gen_paper_data_processing=(state=default_states.wr_gen_paper_data_processing,action=null)=>{
    switch (action.type) {
        case GEN_PAPER_DATA_START:
            return true;
        case GEN_PAPER_DATA_SUCCESS:
        case GEN_PAPER_DATA_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_gen_paper_data_processing;