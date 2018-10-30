/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {
    DIAGNOSE_UNIT_SELECT_STU,
    DIAGNOSE_KNOWLEDGE_SELECT_STU,
    FETCH_DIAGNOSE_Q_RECORDS_SUCCESS
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let stu_with_records_diagnose=(state=defaultStates.stu_with_records_diagnose,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    let unitSelectKnowledge,unitId,clazzId,knowledgeStateKey,stuId;
    switch (action.type){
        /* 单元下选择学生*/
        case DIAGNOSE_UNIT_SELECT_STU:
            unitSelectKnowledge=payload.stu.knowledgePoint;
            if(!unitSelectKnowledge) return nextState;
            unitId=payload.stu.selectedUnitId;
            clazzId=payload.stu.selectedClazzId;
            knowledgeStateKey=clazzId+'#'+unitId+'/'+unitSelectKnowledge.knowledgeId;
            stuId=payload.stu.studentId;
            nextState[knowledgeStateKey+'/'+stuId]={};
            return nextState;
        /* 知识点下选择学生*/
        case DIAGNOSE_KNOWLEDGE_SELECT_STU:
            unitSelectKnowledge=payload.selectedKnowpoint;
            unitId=unitSelectKnowledge.unitId;
            clazzId=unitSelectKnowledge.clazzId;
            knowledgeStateKey=clazzId+'#'+unitId+'/'+unitSelectKnowledge.knowledgeId;
            stuId=payload.stu.studentId;
            nextState[knowledgeStateKey+'/'+stuId]={};
            return nextState;
        /* 获取学生对应的做题记录*/
        case FETCH_DIAGNOSE_Q_RECORDS_SUCCESS:
            unitSelectKnowledge=payload.selectedKnowpoint;
            unitId=payload.stu.selectedUnitId;
            clazzId=payload.stu.selectedClazzId;
            knowledgeStateKey=clazzId+'#'+unitId+'/'+unitSelectKnowledge.knowledgeId;
            stuId=payload.stu.studentId;
            let statekey=knowledgeStateKey+'/'+stuId;
            nextState[statekey].lastKey=payload.reponseData.lastKey;
            if(payload.reponseData.showListText){
                nextState[statekey].showListText=payload.reponseData.showListText;
                nextState[statekey].signalGraph=payload.reponseData.signalGraph;
            }
            if(payload.loadMore&& nextState[statekey].qRecords&&nextState[statekey].qRecords.length){
                nextState[statekey].qRecords=nextState[statekey].qRecords.concat(payload.reponseData.qRecords);
            }else{
                nextState[statekey].qRecords=payload.reponseData.qRecords;
            }
            return nextState;
        default:
            return state;
    }

};
export  default stu_with_records_diagnose;
