/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let unit_with_diagnose_stati=(state=defaultStates.unit_with_diagnose_stati,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        /* 获取单元的诊断统计信息成功*/
        case FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS:
            nextState[payload.classId+'#'+payload.unitId]=payload.unitDiagnoseStati;
            return nextState;
        default:
            return state;
    }
};
export  default unit_with_diagnose_stati;
