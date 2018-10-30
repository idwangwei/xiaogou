/**
 * Created by ww on 2016/11/23.
 */
import {FIGHTER_RANK} from  "../action_types";
import * as defaultStates from "../default_states/index";

export  default (state = defaultStates.fetch_fighter_rank_data_processing, action = null)=> {
    switch (action.type) {
        case FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_START:
            return true;
        case FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_SUCCESS:
            return false;
        case FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_FAIL:
            return false;
        default:
            return state;
    }
};
