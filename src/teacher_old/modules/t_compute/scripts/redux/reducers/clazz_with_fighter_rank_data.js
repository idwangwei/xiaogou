/**
 * Created by ww on 2016/11/23.
 */
import {FIGHTER_RANK} from  "../action_types";
import * as defaultStates from "../default_states/index";
import _assign from 'lodash.assign';

export  default (state = defaultStates.clazz_with_fighter_rank_data, action = null)=> {
    switch (action.type) {
        case FIGHTER_RANK.FETCH_FIGHTER_RANK_DATA_SUCCESS:
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
