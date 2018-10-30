/**
 * Created by WL on 2017/6/8.
 */
import {STU_WORK_REPORT} from './../../action_typs';
import * as defaultStates  from './../../default_states/index';
import lodash_assign from 'lodash.assign';



let change_diagnose_report_records_pagination_info=(state=defaultStates.change_diagnose_report_records_pagination_info,action=null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type){
        case STU_WORK_REPORT.CHANGE_DIAGNOSE_REPORT_RECORDS_PAGINATION_INFO:
            let payload = action.payload;
            nextState = {
                lastKey: payload.lastKey, quantity: payload.quantity
            };
            return nextState;
        default :
            return state;
    }
};
export  default change_diagnose_report_records_pagination_info;