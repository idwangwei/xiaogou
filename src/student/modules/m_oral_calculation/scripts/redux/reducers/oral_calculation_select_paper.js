/**
 * Created by WL on 2017/9/5.
 */
import * as default_states from '../default_states/index';

import {
    FETCH_ORAL_CALCULATION_PAPER_START ,
    FETCH_ORAL_CALCULATION_PAPER_SUCCESS ,
    FETCH_ORAL_CALCULATION_PAPER_FAIL } from '../action_types';

export default (state = default_states.oral_calculation_select_paper, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_ORAL_CALCULATION_PAPER_START:
        case FETCH_ORAL_CALCULATION_PAPER_FAIL:
            return nextState;
        case FETCH_ORAL_CALCULATION_PAPER_SUCCESS:
            nextState = action.payload;
            return nextState;
        default:
            return nextState;
    }
};