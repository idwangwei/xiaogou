/**
 * Created by 邓小龙 on 2016/8/16.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let first_submit_work_after_update=(state=defaultStates.first_submit_work_after_update,action=null)=>{
    switch (action.type){
        case DIAGNOSE.CHANGE_FIRST_SUBMIT_WORK_AFTER_UPDATE_FLAG:
            return false;
        default:
            return state;
    }
};

export  default first_submit_work_after_update;