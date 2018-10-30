/**
 * Created by ww on 2016/11/23.
 */
import {GAME_STAR_RANK} from  "./../../action_typs/index";
import * as defaultStates from "./../../default_states/index";
import _assign from 'lodash.assign';

export  default (state = defaultStates.clazz_with_game_star_rank_data, action = null)=> {
    switch (action.type) {
        case GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_SUCCESS:
            let nextState = _assign({}, state);
            let payload = action.payload;
            if(payload.data && payload.data.length != 0){
                nextState[payload.clazzId] = payload.data;
            }
            return nextState;
        default:
            return state;
    }
};
