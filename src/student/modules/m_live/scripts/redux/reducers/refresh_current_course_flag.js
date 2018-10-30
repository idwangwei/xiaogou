/**
 * Created by qiyuexi on 2018/5/18.
 */
import * as default_states from '../default_states/index';

import {SET_CURRENT_COURSE_FLAG} from '../action_types';

export default (state = default_states.refresh_current_course_flag, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case SET_CURRENT_COURSE_FLAG:
            return action.payload;
        default:
            return state;
    }
};