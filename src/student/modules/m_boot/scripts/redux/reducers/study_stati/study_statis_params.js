import * as types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let study_statis_params = (state = default_states.study_statis_params, action)=> {
    switch (action.type) {
        case (types.STUDY_STATI.CHANGE_STUDY_STATIS_PARAMS):
            return Object.assign({}, state, {
                [action.payload.clazzId]: action.payload.selectedParams
            });
        default:
            return state;
    }
};
export default study_statis_params;