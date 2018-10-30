/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_is_fetch_doPaper_loading(state = defaultStates.wl_is_fetch_doPaper_loading, action = null) {
    switch (action.type) {
        case WORK_LIST.WORK_LIST_FETCH_DO_PAPER_START:
            return true;
        case WORK_LIST.WORK_LIST_FETCH_DO_PAPER_SUCCESS:
            return false;
        case WORK_LIST.WORK_LIST_FETCH_DO_PAPER_FAILED:
            return false;
        default :
            return state;
    }
}
export default wl_is_fetch_doPaper_loading;