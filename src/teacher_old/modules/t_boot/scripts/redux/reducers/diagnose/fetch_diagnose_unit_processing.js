/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    FETCH_DIAGNOSE_TEXTBOOK_LIST_START,
    FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS,
    FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let fetch_diagnose_unit_processing=(state=defaultStates.fetch_diagnose_unit_processing,action=null)=>{
    switch (action.type){
        case FETCH_DIAGNOSE_TEXTBOOK_LIST_START:
            return true;
        case FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS:
            return false;
        case FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};
export  default fetch_diagnose_unit_processing;
