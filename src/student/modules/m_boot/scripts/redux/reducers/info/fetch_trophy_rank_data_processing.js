/**
 * Created by 邓小龙 on 2016/10/20.
 */
import {TROPHY_RANK} from  "./../../actiontypes/actiontypes";
import * as defaultStates from "./../../default_states/default_states";
let fetch_trophy_rank_data_processing=(state=defaultStates.fetch_trophy_rank_data_processing,action=null)=>{
    switch (action.type){
        case TROPHY_RANK.FETCH_TROPHY_RANK_START:
            return true;
        case TROPHY_RANK.FETCH_TROPHY_RANK_SUCCESS:
            return false;
        case TROPHY_RANK.FETCH_TROPHY_RANK_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_trophy_rank_data_processing;