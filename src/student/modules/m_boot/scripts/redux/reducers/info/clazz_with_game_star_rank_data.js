/**
 * Created by ww on 2016/11/23.
 */
import {GAME_STAR_RANK} from  "./../../actiontypes/actiontypes";
import * as defaultStates from "./../../default_states/default_states";
import _assign from 'lodash.assign';
import _sortBy from 'lodash.sortby';

export  default (state = defaultStates.clazz_with_game_star_rank_data, action = null)=> {
    switch (action.type) {
        case GAME_STAR_RANK.FETCH_GAME_STAR_RANK_DATA_SUCCESS:
            let nextState = _assign({}, state);
            let payload = action.payload;
            if(payload.data && payload.data.length != 0){
                nextState[payload.clazzId] = payload.data;
                // nextState[payload.clazzId] = _sortBy(payload.data, (v)=>{
                //     return -v.starAmount
                // });
            }
            return nextState;
        default:
            return state;
    }
};
