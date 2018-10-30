/**
 * Created by 邓小龙 on 2016/8/19.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
let diagnose_submit_q_processing=(state=defaultStates.diagnose_submit_q_processing,action=null)=>{
    switch (action.type){
        case DIAGNOSE.DIAGNOSE_SUBMIT_Q_START:
            return true;
        case DIAGNOSE.DIAGNOSE_SUBMIT_Q_SUCCESS:
            return false;
        case DIAGNOSE.DIAGNOSE_SUBMIT_Q_FAIL:
            return false;
        default:
            return state;
    }
};

export default diagnose_submit_q_processing;