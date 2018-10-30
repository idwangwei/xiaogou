/**
 * Created by 邓小龙 on 2016/8/16.
 */
import {
    DIAGNOSE_UNIT_SELECT_STU
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let diagnose_unit_select_stu=(state=defaultStates.diagnose_unit_select_stu,action=null)=>{
    switch (action.type){
        case DIAGNOSE_UNIT_SELECT_STU:
            return Object.assign({},action.payload.stu);
        default:
            return state;
    }
};

export  default diagnose_unit_select_stu;