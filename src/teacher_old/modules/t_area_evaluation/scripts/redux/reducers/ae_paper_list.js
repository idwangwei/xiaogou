/**
 * Created by qiyuexi on 2018/3/13.
 */
import * as default_states from './../default_states/index';

import {GET_AE_LIST} from './../action_types'


let wr_textbooks=(state=default_states.ae_paper_list,action=null)=>{
    switch (action.type) {
        case GET_AE_LIST.GET_AE_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export  default wr_textbooks;