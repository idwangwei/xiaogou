/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_START,
    FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS,
    FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let fetch_dianose_unit_knowledge_stati_processing=(state=defaultStates.fetch_dianose_unit_knowledge_stati_processing,action=null)=>{
    switch (action.type){
        case FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_START:
            return true;
        case FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS:
            return false;
        case FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL:
            return false;
        default:
            return state;
    }
};
export  default fetch_dianose_unit_knowledge_stati_processing;
