/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_is_worklist_loading(state = defaultStates.wl_is_worklist_loading, action = null) {
    switch (action.type) {
        case WORK_LIST.FETCH_WORK_LIST_START:
            return true;
        case WORK_LIST.FETCH_WORK_LIST_SUCCESS:
            return false;
        case WORK_LIST.FETCH_WORK_LIST_FAILED:
            return false;
        default :
            return state;
    }
}
export default wl_is_worklist_loading;