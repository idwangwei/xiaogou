/**
 * Created by WL on 2017/9/15.
 */
import * as default_states from '../default_states/index';

import {
    ORAL_CALCULATION_WORK_LIST_SELECT_WORK} from '../action_types';

export default (state = default_states.oral_calculation_select_paper_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case ORAL_CALCULATION_WORK_LIST_SELECT_WORK:
            nextState = action.payload;
            return nextState;
        default:
            return nextState;
    }
};