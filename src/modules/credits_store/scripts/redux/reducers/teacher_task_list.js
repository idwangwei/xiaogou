/**
 * Created by ZL on 2017/11/9.
 */
import * as default_states from '../default_states/index';

import {TEACHER_TASK} from '../action_types';

export default (state = default_states.teacher_task_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case TEACHER_TASK.FETCH_TASK_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};