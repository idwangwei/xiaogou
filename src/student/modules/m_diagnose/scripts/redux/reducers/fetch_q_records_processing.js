/**
 * Created by 邓小龙 on 2016/8/17.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
let fetch_q_records_processing=(state=defaultStates.fetch_q_records_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.FETCH_Q_RECORDS_START:
            return true;
        case DIAGNOSE.FETCH_Q_RECORDS_SUCCESS:
            return false;
        case DIAGNOSE.FETCH_Q_RECORDS_FAIL:
            return false;
        default:
            return state;
    }
};

export default fetch_q_records_processing;
