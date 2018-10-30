import * as default_states from './../../default_states/index';
import {
    SELECT_UNIT
} from './../../action_typs';
import _assign from 'lodash.assign';
let wr_selected_unit=(state=default_states.wr_selected_unit,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case SELECT_UNIT:
            newState.chapterName = action.payload.chapterName;
            newState.unitName = action.payload.unitName;
            newState.unitId = action.payload.unitId;
            newState.isFirst = action.payload.isFirst;
            return newState;
        default:
            return state;
    }

};

export  default wr_selected_unit;