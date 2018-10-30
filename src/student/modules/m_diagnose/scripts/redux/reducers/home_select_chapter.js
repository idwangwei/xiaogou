/**
 * Created by 邓小龙 on 2016/8/16.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let home_select_chapter=(state=defaultStates.home_select_chapter,action=null)=>{
    switch (action.type){
        case DIAGNOSE.HOME_SELECT_CHAPTER:
            return Object.assign({},action.payload);
        default:
            return state;
    }
};

export  default home_select_chapter;