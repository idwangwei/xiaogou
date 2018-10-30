/**
 * Created by qiyuexi on 2018/3/27.
 */
import * as default_states from './../default_states/index';

import {FETCH_ALL_REPORT_INFO} from './../action_types'


let wr_textbooks=(state=default_states.ae_all_report_info,action=null)=>{
    switch (action.type) {
        case FETCH_ALL_REPORT_INFO:
            return action.payload;
        default:
            return state;
    }
};

export  default wr_textbooks;