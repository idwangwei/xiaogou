/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {APP_FLAG} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
import _assign from 'lodash.assign';

function wl_is_local_ans_changed(state = defaultStates.wl_is_local_ans_changed, action = null) {
    let newState = _assign({},state);
    let payload = action.payload;
    switch (action.type) {
        case APP_FLAG.SAVE_LOCAL_ANS_TO_SERVER:
            delete newState[payload.paperInstanceId];
            return newState;
        case APP_FLAG.NEED_SAVE_LOCAL_ANS_TO_SERVER:
            newState[payload.paperInstanceId] = true;
            return newState;
        default :
            return state;
    }
}
export default wl_is_local_ans_changed;