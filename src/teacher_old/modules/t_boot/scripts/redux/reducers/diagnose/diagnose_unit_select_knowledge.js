/**
 * Created by 邓小龙 on 2016/8/16.
 */
import {
    DIAGNOSE_UNIT_SELECT_KNOWLEDGE
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let diagnose_unit_select_knowledge=(state=defaultStates.diagnose_unit_select_knowledge,action=null)=>{
    switch (action.type){
        case DIAGNOSE_UNIT_SELECT_KNOWLEDGE:
            return Object.assign({},action.payload);
        default:
            return state;
    }
};

export  default diagnose_unit_select_knowledge;