/**
 * Created by ZL on 2018/3/26.
 */
import * as default_states from '../default_states/index';

import {QUES_CONTENT} from '../action_types';

export default (state = default_states.edit_ques_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case QUES_CONTENT.SAVE_QUES_TITLE:
            nextState.quesTitle = action.playLoad.quesTitle;
            return nextState;
        case QUES_CONTENT.SAVE_QUES_IMG_LIST:
            nextState.imageList = action.playLoad.imageList;
            return nextState;
        case QUES_CONTENT.SAVE_QUES_ANS_OPTIONS:
            nextState.quesRightAns = action.playLoad.quesRightAns;
            // nextState.quesWrongAns = action.playLoad.quesWrongAns;
            nextState.quesOptionsAns = action.playLoad.quesOptionsAns;
            return nextState;
        case QUES_CONTENT.CLEAR_QUES_CONTENT:
            nextState = {};
            return nextState;
        default:
            return state;
    }
};