/**
 * Created by WL on 2017/6/26.
 */
import * as default_states from '../default_states/index';

import {
    FETCH_GAME_MAP_ATLAS_START ,
    FETCH_GAME_MAP_ATLAS_SUCCESS ,
    FETCH_GAME_MAP_ATLAS_FAIL } from '../action_types';

export default (state = default_states.game_map_atlas_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_GAME_MAP_ATLAS_START:
            return true;
        case FETCH_GAME_MAP_ATLAS_SUCCESS:
        case FETCH_GAME_MAP_ATLAS_FAIL:
            return false;
        default:
            return nextState;
    }
};