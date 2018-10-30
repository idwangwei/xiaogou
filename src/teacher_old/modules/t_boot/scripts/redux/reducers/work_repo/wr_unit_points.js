import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';

import {
     FETCH_UNIT_POINTS_START
    ,FETCH_UNIT_POINTS_SUCCESS
    ,FETCH_UNIT_POINTS_FAIL
} from './../../action_typs'


let wr_unit_points=(state=default_states.wr_unit_points,action=null)=>{
    let nextState = _assign({},state);
    switch (action.type) {
        case FETCH_UNIT_POINTS_SUCCESS:
            nextState[action.payload.id] = action.payload.list;
            return nextState;
        default:
            return state;
    }
};

export  default wr_unit_points;