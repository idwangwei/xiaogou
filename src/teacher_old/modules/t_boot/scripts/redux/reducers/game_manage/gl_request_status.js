/**
 * Created by liangqinli on 2016/10/12.
 */
import {
    GAMES_LIST_REQUEST,  GAMES_LIST_FAILURE,
    DEL_GAME_REQUEST,  DEL_GAME_FAILURE,
    MOVE_GAME_START, MOVE_GAME_FAILURE,
    GAME_STATS_REQUEST,GAME_STATS_FAILURE
} from '../../action_typs';

import {
    gl_request_status
} from './../../default_states/index';

export default function (state = gl_request_status, action) {
    switch (action.type) {
        case GAMES_LIST_REQUEST:
            return Object.assign({}, state, {
                get_game_list_processing: true
            });
        case GAMES_LIST_FAILURE:
            return Object.assign({}, state, {
                get_game_list_processing: false
            });
        case DEL_GAME_REQUEST:
            return Object.assign({}, state, {
                del_game_processing: true
            });

        case DEL_GAME_FAILURE:
            return Object.assign({}, state, {
                del_game_processing: false
            });
        case MOVE_GAME_START:
            return Object.assign({}, state, {
                move_game_processing: true
            });

        case MOVE_GAME_FAILURE:
            return Object.assign({}, state, {
                move_game_processing: false
            });
        case GAME_STATS_REQUEST:
            return Object.assign({}, state, {
                get_game_stats_processing: true
            });
        case GAME_STATS_FAILURE:
            return Object.assign({}, state, {
                get_game_stats_processing: false
            });
        default:
            return state;
    }
}