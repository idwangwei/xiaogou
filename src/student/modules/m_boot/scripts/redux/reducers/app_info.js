/**
 * Created by 彭建伦 on 2016/4/21.
 */

import * as types from '../actiontypes/actiontypes';
import * as default_states from './../default_states/default_states';
function app_info(state = default_states.app_info, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        /*app version*/
        case types.APP_INFO.FETCH_APP_INFO_SUCCESS:
            nextState.appVersion = action.payload;
            return nextState;
        case types.APP_INFO.FETCH_APP_INFO_FAIL:
            nextState.errorInfo = action.payload;
            return nextState;

        /*app change log*/
        case types.APP_INFO.FETCH_APP_CHANGE_LOG_SUCCESS:
            nextState.changeLog = action.payload;
            return nextState;
        case types.APP_INFO.FETCH_APP_CHANGE_LOG_FAIL:
            nextState.errorInfo = action.payload;
            return nextState;
        case types.APP_INFO.CHANGE_NETWORK_STATUS:
            nextState.onLine = action.payload;
            return nextState;
        case types.PROFILE.SET_LOCAL_STATE_FOR_USER:
            return action.payload.app_info;
        case types.PROFILE.SET_DEFAULT_STATE_FOR_USER:
            return default_app_info;
        default:
            return state;
    }
}
export default app_info;
