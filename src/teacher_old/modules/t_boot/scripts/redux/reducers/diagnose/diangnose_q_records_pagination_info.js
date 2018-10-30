/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let diangnose_q_records_pagination_info=(state=defaultStates.diangnose_q_records_pagination_info,action=null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type){
        case CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO:
            let payload = action.payload;
            nextState = {
                lastKey: payload.lastKey, quantity: payload.quantity
            };
            return nextState;
        default :
            return state;
    }
};
export  default diangnose_q_records_pagination_info;
