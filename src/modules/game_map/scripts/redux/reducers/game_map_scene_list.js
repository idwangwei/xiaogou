/**
 * Created by WL on 2017/6/23.
 */
import * as default_states from '../default_states/index';

import {FETCH_GAME_MAP_SCENE_LIST_START,
    FETCH_GAME_MAP_SCENE_LIST_SUCCESS,
    FETCH_GAME_MAP_SCENE_LIST_FAIL } from '../action_types';

export default (state = default_states.game_map_scene_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_GAME_MAP_SCENE_LIST_START:
        case FETCH_GAME_MAP_SCENE_LIST_FAIL:
            return nextState;
        case FETCH_GAME_MAP_SCENE_LIST_SUCCESS:
            return action.payload;
        default:
            return nextState;
    }
};