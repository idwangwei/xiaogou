/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    DIAGNOSE_UNIT_SELECT_KNOWLEDGE,
    FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let knowledge_with_diagnose_stati=(state=defaultStates.knowledge_with_diagnose_stati,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    let unitSelectKnowledge,unitId,clazzId,knowledgeStateKey;
    switch (action.type){
        /* 单元下选择子知识点*/
        case DIAGNOSE_UNIT_SELECT_KNOWLEDGE:
            unitSelectKnowledge=payload;
            unitId=unitSelectKnowledge.unitId;
            clazzId=unitSelectKnowledge.clazzId;
            knowledgeStateKey=clazzId+'#'+unitId+'/'+unitSelectKnowledge.knowledgeId;
            nextState[knowledgeStateKey]={};
            return nextState;
        /* 获取单元的诊断统计信息成功*/
        case FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS:
            unitSelectKnowledge=payload.selectedKnowpoint;
            unitId=unitSelectKnowledge.unitId;
            clazzId=unitSelectKnowledge.clazzId;
            knowledgeStateKey=clazzId+'#'+unitId+'/'+unitSelectKnowledge.knowledgeId;
            nextState[knowledgeStateKey]=payload.knowledgeDiagnoseStati;
            return nextState;
        default:
            return state;
    }
};
export  default knowledge_with_diagnose_stati;
