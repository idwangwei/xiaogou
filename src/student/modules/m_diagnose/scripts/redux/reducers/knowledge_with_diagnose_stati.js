/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import {getDiagnoseknowledgeStateKey} from '../state_common_keys/state_common_keys';
import lodash_assign from 'lodash.assign';

let handle =(selectedKnowpoint,nextState,stateKey,stateValue)=>{
    let knowledgeStateKey=getDiagnoseknowledgeStateKey(selectedKnowpoint);
    if(stateKey)
         nextState[knowledgeStateKey][stateKey]=stateValue;
    return nextState[knowledgeStateKey];
};

let knowledge_with_diagnose_stati=(state=defaultStates.unit_with_diagnose_stati,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    let knowledgeInfo;
    switch (action.type){
        //单元下选中一个子知识点
        case DIAGNOSE.UNIT_SELECT_KNOWLEDGE:
            handle(payload,nextState);
            let knowledgeStateKey=getDiagnoseknowledgeStateKey(payload);
            nextState[knowledgeStateKey]=nextState[knowledgeStateKey]?nextState[knowledgeStateKey]:{};
            return nextState;
        /* 获取子知识点的统计信息成功*/
        case DIAGNOSE.FETCH_UNIT_KNOWLEDGE_STATI_SUCCESS:
            if(!payload.knowledgeDiagnoseStati){return state}
            handle(payload.selectedKnowpoint,nextState,"knowledgeDiagnoseStati",payload.knowledgeDiagnoseStati);
            return nextState;
        /* 获取做题记录成功*/
        case DIAGNOSE.FETCH_Q_RECORDS_SUCCESS:
            if(!payload.qRecords){return state}
            knowledgeInfo=handle(payload.selectedKnowpoint,nextState);
            if(payload.loadMore&&knowledgeInfo.qRecords&&knowledgeInfo.qRecords.length){
                knowledgeInfo.qRecords=knowledgeInfo.qRecords.concat(payload.qRecords);
            }else{
                knowledgeInfo.qRecords=payload.qRecords;
            }
            return nextState;
        /* 获取试题成功,有题返回（包含改错）*/
        /*case DIAGNOSE.FETCH_QUESTION_SUCCESS:
            if(!payload.questionInfo){return state}
            knowledgeInfo=handle(payload.selectedKnowpoint,nextState,"questionInfo",payload.questionInfo);
            knowledgeInfo.noQuestionTip="";
            return nextState;*/
        /* 获取试题成功,无题返回（包含改错）*/
        case DIAGNOSE.FETCH_QUESTION_NO_QUESTION:
            if(!payload.noQuestionTip){return state}
            handle(payload.selectedKnowpoint,nextState,"noQuestionTip",payload.noQuestionTip);
            return nextState;
        /* 保存试题*/
        case DIAGNOSE.DIAGNOSE_SAVE_QUESTION:
            if(!payload.selectedKnowpoint){return state}
            knowledgeInfo=handle(payload.selectedKnowpoint,nextState,"questionInfo",payload.questionInfo);
            return nextState;
        /* 清除试题*/
        case DIAGNOSE.DIAGNOSE_CLEAR_QUESTION:
            if(!payload.selectedKnowpoint){return state}
            knowledgeInfo=handle(payload.selectedKnowpoint,nextState);
            knowledgeInfo.knowledgeDiagnoseStati=null;
            knowledgeInfo.noQuestionTip=null;
            knowledgeInfo.questionInfo=null;
            return nextState;
        /* 提交试题成功（包含改错）*/
        case DIAGNOSE.DIAGNOSE_SUBMIT_Q_SUCCESS:
           /* if(!payload.selectedKnowpoint){return state}
            knowledgeInfo=handle(payload.selectedKnowpoint,nextState);
            knowledgeInfo.knowledgeDiagnoseStati.suggestCode=payload.knowledgeDiagnoseStati.suggestCode;
            knowledgeInfo.noQuestionTip="";
            knowledgeInfo.questionInfo=payload.knowledgeDiagnoseStati.questionInfo;*/
            return nextState;
        default:
            return state;
    }
};
export  default knowledge_with_diagnose_stati;
