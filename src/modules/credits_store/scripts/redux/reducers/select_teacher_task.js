/**
 * Created by ZL on 2017/11/9.
 */
import * as default_states from '../default_states/index';

import {TEACHER_TASK} from '../action_types';

export default (state = default_states.select_teacher_task, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case TEACHER_TASK.SELECT_TEACHER_TASK:
            return action.payload;
        default:
            return state;
    }
};