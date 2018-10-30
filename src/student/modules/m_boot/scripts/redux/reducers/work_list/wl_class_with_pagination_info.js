/**
 * Created by 邓小龙 on 2016/9/1.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_class_with_pagination_info(state = defaultStates.wl_class_with_pagination_info, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WORK_LIST.CHANGE_CLASS_PAGINATION_INFO:
            let payload = action.payload;
            nextState[payload.clazzId] = payload.limitQuery;
            return nextState;
        default :
            return state;
    }
}
export default wl_class_with_pagination_info;