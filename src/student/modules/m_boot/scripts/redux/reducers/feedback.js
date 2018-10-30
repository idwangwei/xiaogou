import * as types from '../actiontypes/actiontypes';
import * as default_states from './../default_states/default_states';
function feedback(state = default_states.feedback, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case types.FEEDBACK.SUBMIT_SUGGESTION_START:
            return Immutable.fromJS(action.payload);
        case types.FEEDBACK.SUBMIT_SUGGESTION_SUCCESS:
            return Immutable.fromJS(action.payload);
        case types.FEEDBACK.SUBMIT_SUGGESTION_FAIL:
            return state.set('isSuggestionSubmitProcessing', false);
        case types.FEEDBACK.SAVE_SUGGESTION_GO_BACK:
            return state.set('suggestionWord', action.suggestionWord);

        case types.PROFILE.SET_LOCAL_STATE_FOR_USER:
            return action.payload.feedback;
        case types.PROFILE.SET_DEFAULT_STATE_FOR_USER:
            return default_feedback;
        default:
            return state;
    }
}
export default feedback;