/**
 * Created by 邓小龙 on 2016/8/16.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let chapter_select_point=(state=defaultStates.chapter_select_point,action=null)=>{
    switch (action.type){
        case DIAGNOSE.CHAPTER_SELECT_POINT:
            return Object.assign({},action.payload);
        case DIAGNOSE.DIAGNOSE_SUBMIT_Q_SUCCESS:
            return Object.assign({},action.payload);
        default:
            return state;
    }
};

export  default chapter_select_point;