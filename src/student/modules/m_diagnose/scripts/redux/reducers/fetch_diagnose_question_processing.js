/**
 * Created by 邓小龙 on 2016/8/18.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
let fetch_diagnose_question_processing=(state=defaultStates.fetch_diagnose_question_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.FETCH_QUESTION_START:
            return true;
        case DIAGNOSE.FETCH_QUESTION_SUCCESS:
        case DIAGNOSE.FETCH_QUESTION_STEP_STATUS_SUCCESS:
            return false;
        case DIAGNOSE.FETCH_QUESTION_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_diagnose_question_processing;