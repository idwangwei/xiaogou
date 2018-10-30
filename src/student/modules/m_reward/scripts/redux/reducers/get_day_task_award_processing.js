/**
 * Created by Administrator on 2017/5/8.
 */
import * as default_states from '../default_states/index';

import {GET_DAY_TASK_INFO_START,
    GET_DAY_TASK_INFO_SUCCESS,
    GET_DAY_TASK_INFO_FAIL} from '../action_types';

export default (state = default_states.get_day_task_award_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case GET_DAY_TASK_INFO_START:
            return true;
        case GET_DAY_TASK_INFO_SUCCESS:
            return false;
        case GET_DAY_TASK_INFO_FAIL:
            return false;
        default:
            return state;
    }
};