/**
 * Created by ww on 2016/11/23.
 */
import {GAME_STAR_RANK} from  "./../../action_typs/index";
import * as defaultStates from "./../../default_states/index";

export  default (state = defaultStates.fetch_game_star_rank_data_processing, action = null)=> {
    switch (action.type) {
        case GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_START:
            return true;
        case GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_SUCCESS:
            return false;
        case GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_FAIL:
            return false;
        default:
            return state;
    }
};
