/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


let q_with_error_records=(state=defaultStates.unit_with_diagnose_stati,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        //去查看错题记录
        case DIAGNOSE.GO_TO_ERROR_RECORDS:
            nextState[payload.qStateKey]=nextState[payload.qStateKey]?nextState[payload.qStateKey]:{};
            return nextState;
        /* 获取错题记录成功*/
        case DIAGNOSE.FETCH_ERROR_Q_RECORDS_SUCCESS:
           /* if(!payload.qErrorRecords){return state}
            nextState[payload.qStateKey].qErrorRecords=payload.qErrorRecords;*/
            return nextState;
        default:
            return state;
    }
};
export  default q_with_error_records;
