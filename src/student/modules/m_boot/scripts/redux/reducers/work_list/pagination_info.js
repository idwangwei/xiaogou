/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_pagination_info(state = defaultStates.wl_pagination_info, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WORK_LIST.CHANGE_WORK_LIST_PAGINATION_INFO:
            let payload = action.payload;
            nextState = {
                lastKey: payload.lastKey, quantity: payload.quantity
            };
            return nextState;
        default :
            return state;
    }
}
export default wl_pagination_info;