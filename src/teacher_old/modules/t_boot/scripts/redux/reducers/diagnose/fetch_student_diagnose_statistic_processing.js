/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    FETCH_STUDENT_DIAGNOSE_STATISTIC_START,
    FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS,
    FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let fetch_student_diagnose_statistic_processing=(state=defaultStates.fetch_student_diagnose_statistic_processing,action=null)=>{
    switch (action.type){
        case FETCH_STUDENT_DIAGNOSE_STATISTIC_START:
            return true;
        case FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS:
            return false;
        case FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL:
            return false;
        default:
            return state;
    }
};
export  default fetch_student_diagnose_statistic_processing;
