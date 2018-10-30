/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';

let knowledge_with_question=(state=defaultStates.knowledge_with_question,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        /* 获取知识点的试题成功*/
        case DIAGNOSE.FETCH_QUESTION_SUCCESS:
            nextState[payload.selectedKnowpoint.knowledgeId]=payload.questionInfo;
            return nextState;
        case DIAGNOSE.FETCH_QUESTION_STEP_STATUS_SUCCESS:
            nextState[payload.selectedKnowpoint.knowledgeId].newQuestionNum = payload.newQuestionNum;
            nextState[payload.selectedKnowpoint.knowledgeId].errorQuestionNum = payload.errorQuestionNum;
            return nextState;
        default:
            return state;
    }
};
export  default knowledge_with_question;
