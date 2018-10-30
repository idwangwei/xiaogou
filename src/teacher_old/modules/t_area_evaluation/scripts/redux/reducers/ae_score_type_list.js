/**
 * Created by qiyuexi on 2018/3/13.
 */
import * as default_states from './../default_states/index';

import {LIST_OBJ} from './../action_types'


let wr_textbooks=(state=default_states.ae_score_type_list,action=null)=>{
    switch (action.type) {
        case LIST_OBJ.GET_SCORE_TYPE_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

export  default wr_textbooks;