/**
 * Created by WL on 2017/6/26.
 */
import * as default_states from '../default_states/index';

import {
    FETCH_GAME_MAP_ATLAS_START ,
    FETCH_GAME_MAP_ATLAS_SUCCESS ,
    FETCH_GAME_MAP_ATLAS_FAIL,
    CHANGE_GAME_MAP_ATLAS} from '../action_types';

export default (state = default_states.game_map_atlas_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_GAME_MAP_ATLAS_START:
        case FETCH_GAME_MAP_ATLAS_FAIL:
            return nextState;
        case FETCH_GAME_MAP_ATLAS_SUCCESS:
        case CHANGE_GAME_MAP_ATLAS:
            let atlasName = action.payload.name;
            return nextState[atlasName] = action.payload.data;
        default:
            return nextState;
    }
};