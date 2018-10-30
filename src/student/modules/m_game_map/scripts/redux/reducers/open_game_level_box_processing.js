/**
 * Created by WW on 2017/6/28.
 */
import * as default_states from '../default_states/index';

import {
    OPEN_GAME_LEVEL_BOX_START ,
    OPEN_GAME_LEVEL_BOX_SUCCESS ,
    OPEN_GAME_LEVEL_BOX_FAIL } from '../action_types';

export default (state = default_states.open_game_level_box_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case OPEN_GAME_LEVEL_BOX_START:
            return true;
        case OPEN_GAME_LEVEL_BOX_SUCCESS:
        case OPEN_GAME_LEVEL_BOX_FAIL:
            return false;
        default:
            return nextState;
    }
};