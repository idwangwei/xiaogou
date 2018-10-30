import * as types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let clazz_with_study_stati = (state = default_states.clazz_with_study_stati, action)=> {
    switch (action.type) {
        case (types.STUDY_STATI.FETCH_STUDY_STATI_SUCCESS):
            return Object.assign({}, state, {
                [action.payload.clazzId]: {
                    list: action.payload.studyStati,
                    workNum: action.payload.workNum
                }
            });
        default:
            return state;
    }
};
export default clazz_with_study_stati;