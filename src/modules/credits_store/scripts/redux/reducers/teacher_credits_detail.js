/**
 * Created by qiyuexi on 2017/11/10.
 */
import * as default_states from '../default_states';

import {CREDITS_DETAIL} from '../action_types';

export default (state = default_states.teacher_credits_detail, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case CREDITS_DETAIL.FETCH_CREDITS_DETAIL_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};