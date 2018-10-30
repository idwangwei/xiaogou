import * as types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let fetch_study_stati_processing = (state = default_states.fetch_study_stati_processing, action)=> {
    switch (action.type) {
        case (types.STUDY_STATI.FETCH_STUDY_STATI_START):
            return true;
        case (types.STUDY_STATI.FETCH_STUDY_STATI_SUCCESS || types.STUDY_STATI.FETCH_STUDY_STATI_FAIL):
            return false;
        default:
            return state;
    }
};

export  default  fetch_study_stati_processing;