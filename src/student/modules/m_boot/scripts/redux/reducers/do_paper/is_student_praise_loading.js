/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {SELECT_QUESTION} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_is_student_praise_loading(state = defaultStates.wl_is_student_praise_loading, action = null) {
    switch (action.type) {
        case SELECT_QUESTION.FETCH_WORK_STU_PRAISE_START:
            return true;
        case SELECT_QUESTION.FETCH_WORK_STU_PRAISE_SUCCESS:
        case SELECT_QUESTION.FETCH_WORK_STU_PRAISE_FAILED:
            return false;
        default :
            return state;
    }
}
export default wl_is_student_praise_loading;