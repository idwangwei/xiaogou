import * as default_states from './../../default_states/index';
import {
    CHANGE_STUDY_STATIS_PARAMS
} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state=default_states.study_statis_params,action=null)=>{
    switch (action.type) {
        case CHANGE_STUDY_STATIS_PARAMS:
            let newState = _assign({},state);
            newState[action.payload.classId]=action.payload.selectedParams;
            return newState;
        default:
            return state;
    }

};
