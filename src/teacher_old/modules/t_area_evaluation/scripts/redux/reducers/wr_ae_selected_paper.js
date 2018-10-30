/**
 * Created by qiyuexi on 2018/3/23.
 */
import * as default_states from './../default_states/index';

import {SELECT_AREA_AUTO_PAPER} from './../action_types'


let wr_textbooks=(state=default_states.wr_ae_selected_paper,action=null)=>{
    switch (action.type) {
        case SELECT_AREA_AUTO_PAPER:
            return action.payload;
        default:
            return state;
    }
};

export  default wr_textbooks;