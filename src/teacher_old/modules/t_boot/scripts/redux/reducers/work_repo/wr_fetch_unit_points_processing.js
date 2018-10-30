import * as default_states from './../../default_states/index';
import {
     FETCH_UNIT_POINTS_START
    ,FETCH_UNIT_POINTS_SUCCESS
    ,FETCH_UNIT_POINTS_FAIL
} from './../../action_typs'


let wr_fetch_unit_points_processing=(state=default_states.wr_fetch_unit_points_processing,action=null)=>{
    switch (action.type) {
        case FETCH_UNIT_POINTS_START:
            return true;
        case FETCH_UNIT_POINTS_SUCCESS:
        case FETCH_UNIT_POINTS_FAIL:
            return false;
        default:
            return state;
    }
};

export  default wr_fetch_unit_points_processing;