/**
 * Created by ZL on 2017/10/25.
 */
import {PUB_WORK_DIFF_UNIT} from  "./../../action_typs/index";
import * as defaultStates from "./../../default_states/index";
import _assign from 'lodash.assign';

export  default (state = defaultStates.compose_temp_paper, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_START:
            return state;
        case PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_FAIL:
            return state;
        case PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_SUCCESS:
            nextState.tempPaperSetParams = action.payload.setParams;
            nextState.quesList = action.payload.quesList;
            nextState.paperName = action.payload.paperName;
            return nextState;
        case PUB_WORK_DIFF_UNIT.CHANGE_PAPER_SET_PARAMS:
            nextState.tempPaperSetParams = action.payload.setParams;
            nextState.quesList = action.payload.quesList;
            return nextState;
        case PUB_WORK_DIFF_UNIT.CHANGE_PAPER_NAME:
            nextState.paperName = action.payload.paperName;
            return nextState;
        case PUB_WORK_DIFF_UNIT.PUBLISH_TEMP_PAPER_SUCCESS:
            return {};
        default:
            return state;
    }
};