/**
 * Created by 邓小龙 on 2016/8/16.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let fetch_diagnose_report_processing=(state=defaultStates.fetch_diagnose_report_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.FETCH_DIAGNOSE_REPORT_START:
            return true;
        case DIAGNOSE.FETCH_DIAGNOSE_REPORT_SUCCESS:
            return false;
        case DIAGNOSE.FETCH_DIAGNOSE_REPORT_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_diagnose_report_processing;