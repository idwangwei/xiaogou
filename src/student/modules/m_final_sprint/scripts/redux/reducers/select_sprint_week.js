/**
 * Created by qiyuexi on 2017/12/8.
 */
import * as default_states from '../default_states/index';

import {PAPER_LIST} from '../action_types';

export default (state = default_states.select_sprint_week, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case PAPER_LIST.SELECT_PAPER_BY_WEEK:
            return action.payload;
        default:
            return state;
    }
};