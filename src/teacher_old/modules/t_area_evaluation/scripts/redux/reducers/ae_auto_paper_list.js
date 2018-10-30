/**
 * Created by qiyuexi on 2018/3/23.
 */
import * as default_states from './../default_states/index';

import {GET_AUTO_PAPER_LIST} from './../action_types'


let wr_textbooks=(state=default_states.ae_auto_paper_list,action=null)=>{
    switch (action.type) {
        case GET_AUTO_PAPER_LIST.GET_AUTO_PAPER_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export  default wr_textbooks;