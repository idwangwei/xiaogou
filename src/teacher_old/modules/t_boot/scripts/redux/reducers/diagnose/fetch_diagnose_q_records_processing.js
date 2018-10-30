/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    FETCH_DIAGNOSE_Q_RECORDS_START,
    FETCH_DIAGNOSE_Q_RECORDS_SUCCESS,
    FETCH_DIAGNOSE_Q_RECORDS_FAIL
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let fetch_diagnose_q_records_processing=(state=defaultStates.fetch_diagnose_q_records_processing,action=null)=>{
    switch (action.type){
        case FETCH_DIAGNOSE_Q_RECORDS_START:
            return true;
        case FETCH_DIAGNOSE_Q_RECORDS_SUCCESS:
            return false;
        case FETCH_DIAGNOSE_Q_RECORDS_FAIL:
            return false;
        default:
            return state;
    }
};
export  default fetch_diagnose_q_records_processing;
