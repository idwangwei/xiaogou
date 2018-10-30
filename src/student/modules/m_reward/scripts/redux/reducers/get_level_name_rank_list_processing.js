/**
 * Created by WL on 2017/6/14.
 */

import * as default_states from '../default_states/index';

import {FETCH_LEVEL_NAME_RANK_LIST_START,
    FETCH_LEVEL_NAME_RANK_LIST_SUCCESS,
    FETCH_LEVEL_NAME_RANK_LIST_FAIL} from '../action_types';

export default (state = default_states.get_level_name_rank_list_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_LEVEL_NAME_RANK_LIST_START:
            return true;
        case FETCH_LEVEL_NAME_RANK_LIST_SUCCESS:
        case FETCH_LEVEL_NAME_RANK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};