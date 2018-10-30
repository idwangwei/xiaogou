/**
 * Created by qiyuexi on 2017/11/14.
 */
import * as default_states from '../default_states';

import {RATORY_INFO} from '../action_types';

export default (state = default_states.teacher_ratory_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case RATORY_INFO.FETCH_RATORY_INFO_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};