/**
 * Created by Administrator on 2017/5/23.
 */
import * as default_states from '../default_states/index';

import {
    CHANGE_LEVEL_NAME_START,
    CHANGE_LEVEL_NAME_SUCCESS,
    CHANGE_LEVEL_NAME_FAIL
} from '../action_types';

export default (state = default_states.change_level_name_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case CHANGE_LEVEL_NAME_START:
            return true;
        case CHANGE_LEVEL_NAME_SUCCESS:
            return false;
        case CHANGE_LEVEL_NAME_FAIL:
            return false;
        default:
            return state;
    }
};