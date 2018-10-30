/**
 * Created by 邓小龙 on 2016/8/16.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let fetch_chapter_diagnose_processing=(state=defaultStates.fetch_chapter_diagnose_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_START:
            return true;
        case DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_SUCCESS:
            return false;
        case DIAGNOSE.FETCH_CHAPTER_DIAGNOSE_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_chapter_diagnose_processing;