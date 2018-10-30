/**
 * Created by ZL on 2017/12/18.
 */

import {MIRCORLECTURE_QUES} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
import lodash_assign from 'lodash.assign';

export  default (state=defaultStates.example_with_question,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type){
        /* 获取知识点的试题成功*/
        case MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_SUCCESS:
            nextState[payload.examSelectPoint.groupId]=payload.questionInfo;
            return nextState;
        case MIRCORLECTURE_QUES.FETCH_TINY_CLASS__QUESTION_STEP_STATUS_SUCCESS:
            nextState[payload.examSelectPoint.groupId].newQuestionNum = payload.newQuestionNum;
            nextState[payload.examSelectPoint.groupId].errorQuestionNum = payload.errorQuestionNum;
            return nextState;
        default:
            return state;
    }
};