/**
 * Created by 邓小龙 on 2016/8/16.
 */

import {UNIT} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let fetch_diagnose_textbook_processing=(state=defaultStates.fetch_diagnose_textbook_processing,action=null)=>{
    switch (action.type){
        case UNIT.FETCH_TEXTBOOK_LIST_START:
            return true;
        case UNIT.FETCH_TEXTBOOK_LIST_SUCCESS:
            return false;
        case UNIT.FETCH_TEXTBOOK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_diagnose_textbook_processing;