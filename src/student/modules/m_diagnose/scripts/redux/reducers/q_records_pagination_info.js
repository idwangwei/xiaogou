/**
 * Created by 邓小龙 on 2016/8/17.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";


let q_records_pagination_info=(state=defaultStates.q_records_pagination_info,action=null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type){
        case DIAGNOSE.CHANGE_Q_RECORDS_PAGINATION_INFO:
            let payload = action.payload;
            nextState = {
                lastKey: payload.lastKey, quantity: payload.quantity
            };
            return nextState;
        default :
            return state;
    }
};

export  default q_records_pagination_info;