/**
 * Created by ZL on 2018/2/27.
 */
import {PUB_ORAL_WORK_DIFF_UNIT} from  "../action_typs/index";
import * as defaultStates from "../default_states/index";
import _assign from 'lodash.assign';

export  default (state = defaultStates.compose_temp_oral_paper, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_START:
            return state;
        case PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_FAIL:
            return state;
        case PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_SUCCESS:
            nextState.selectBookText = action.payload.selectBookText;
            nextState.tempPaperSetParams = action.payload.setParams;
            nextState.periodQuestionMapItems = action.payload.periodQuestionMapItems;
            nextState.paperName = action.payload.paperName;
            return nextState;
        case PUB_ORAL_WORK_DIFF_UNIT.CHANGE_ORAL_PAPER_SET_PARAMS:
            nextState.tempPaperSetParams = action.payload.setParams;
            nextState.periodQuestionMapItems = action.payload.periodQuestionMapItems;
            return nextState;
        case PUB_ORAL_WORK_DIFF_UNIT.CLEAR_ORAL_PAPER_DATA:
            nextState.tempPaperSetParams = action.payload.setParams;
            nextState.periodQuestionMapItems = action.payload.periodQuestionMapItems;
            nextState.paperName = action.payload.paperName;
            nextState.selectBookText = action.payload.selectBookText;
            return nextState;
        case PUB_ORAL_WORK_DIFF_UNIT.CHANGE_ORAL_PAPER_NAME:
            nextState.paperName = action.payload.paperName;
            return nextState;
        case PUB_ORAL_WORK_DIFF_UNIT.PUBLISH_TEMP_ORAL_PAPER_SUCCESS:
            return {};
        default:
            return state;
    }
};