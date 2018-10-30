/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {SELECT_QUESTION} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_is_paper_submitting(state = defaultStates.wl_is_paper_submitting, action = null) {
    switch (action.type) {
        case SELECT_QUESTION.SUBMIT_PAPER_START:
            return true;
        case SELECT_QUESTION.SUBMIT_PAPER_SUCCESS:
            return false;
        case SELECT_QUESTION.SUBMIT_PAPER_FAILED:
            return false;
        default :
            return state;
    }
}
export default wl_is_paper_submitting;