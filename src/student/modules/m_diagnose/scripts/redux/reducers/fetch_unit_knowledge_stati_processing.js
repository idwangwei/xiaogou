/**
 * Created by 邓小龙 on 2016/8/16.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let fetch_unit_knowledge_stati_processing=(state=defaultStates.fetch_unit_knowledge_stati_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_START:
            return true;
        case DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_SUCCESS:
            return false;
        case DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_unit_knowledge_stati_processing;