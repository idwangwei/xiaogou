/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let stu_with_diagnose_stati=(state=defaultStates.stu_with_diagnose_stati,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        /* 获取学生的诊断统计信息成功*/
        case FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS:
            nextState[payload.stuId]=payload.stuDiagnoseStati;
            return nextState;
        default:
            return state;
    }
};
export  default stu_with_diagnose_stati;