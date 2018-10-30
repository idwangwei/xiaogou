/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";

let fetch_unit_stati_processing=(state=defaultStates.fetch_unit_stati_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.FETCH_UNIT_STATISTIC_START:
            return true;
        case DIAGNOSE.FETCH_UNIT_STATISTIC_SUCCESS:
            return false;
        case DIAGNOSE.FETCH_UNIT_STATISTIC_FAIL:
            return false;
        default:
            return state;
    }
};
export  default fetch_unit_stati_processing;
