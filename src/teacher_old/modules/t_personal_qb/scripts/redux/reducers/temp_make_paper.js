/**
 * Created by ZL on 2018/3/27.
 */
import * as default_states from '../default_states/index';

import {MAKE_PAPER} from '../action_types';

export default (state = default_states.temp_make_paper, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MAKE_PAPER.MAKE_PAPER_FROM_TEACHER_QB_SUCCESS:
            nextState = action.playLoad;
            return nextState;
        case MAKE_PAPER.CHANGE_NAME_MAKE_PAPER_FROM_TEACHER:
            nextState.paperName = action.playLoad.paperName;
            return nextState;
        case MAKE_PAPER.CLEAR_TEMP_MAKE_PAPER:
            nextState = {};
            return nextState;
        default:
            return state;
    }
};