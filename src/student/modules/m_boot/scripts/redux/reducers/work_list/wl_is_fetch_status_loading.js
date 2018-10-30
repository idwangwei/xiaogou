/**
 * Created by 邓小龙 on 2016/8/25.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_is_fetch_status_loading(state = defaultStates.wl_is_fetch_status_loading, action = null) {
    switch (action.type) {
        case WORK_LIST.FETCH_WORK_STATUS_START:
            return true;
        case WORK_LIST.FETCH_WORK_STATUS_SUCCESS:
            return false;
        case WORK_LIST.FETCH_WORK_STATUS_FAILED:
            return false;
        default :
            return state;
    }
}
export default wl_is_fetch_status_loading;