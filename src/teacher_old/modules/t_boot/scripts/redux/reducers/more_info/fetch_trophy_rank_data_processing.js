/**
 * Created by 邓小龙 on 2016/10/20.
 */
import {
    FETCH_TROPHY_RANK_START,
    FETCH_TROPHY_RANK_SUCCESS,
    FETCH_TROPHY_RANK_FAIL
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

let fetch_trophy_rank_data_processing=(state=defaultStates.fetch_trophy_rank_data_processing,action=null)=>{
    switch (action.type){
        case FETCH_TROPHY_RANK_START:
            return true;
        case FETCH_TROPHY_RANK_SUCCESS:
            return false;
        case FETCH_TROPHY_RANK_FAIL:
            return false;
        default:
            return state;
    }
};

export  default fetch_trophy_rank_data_processing;