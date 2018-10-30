/**
 * Created by qiyuexi on 2017/12/8.
 */
import * as default_states from '../default_states/index';

import {SELECT_COURSE} from '../action_types';

export default (state = default_states.select_course, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case SELECT_COURSE:
            return action.payload;
        default:
            return state;
    }
};