/**
 * Created by 彭建伦 on 2016/4/21.
 */

import services from  './index';
import * as types from '../redux/actiontypes/actiontypes';

services.service('appInfoService', [function () {
    this.getAppNumVersion = ()=>(dispatch)=> {
        try {
            if (AppUtils) {
                let version = AppUtils.getAppVersion();
                dispatch({type: types.APP_INFO.FETCH_APP_INFO_SUCCESS, payload: version});
                return;
            }
            dispatch({type: types.APP_INFO.FETCH_APP_INFO_FAIL, payload: {msg: '找不到AppUtils!'}});
        } catch (e) {
            dispatch({type: types.APP_INFO.FETCH_APP_INFO_FAIL, payload: {msg: e}});
        }
    };
    this.getChangeLog = ()=>(dispatch)=> {
        try {
            if (AppUtils) {
                var ret = [];
                var changeLog = AppUtils.getChangeLog();
                AppUtils.isArray(changeLog) && changeLog.forEach(function (val) {
                    ret.push(JSON.stringify(val));
                });
                dispatch({type: types.APP_INFO.FETCH_APP_CHANGE_LOG_SUCCESS, payload: ret});
                return;
            }
            dispatch({type: types.APP_INFO.FETCH_APP_CHANGE_LOG_FAIL, payload: {msg: '找不到AppUtils!'}});
        } catch (e) {
            dispatch({type: types.APP_INFO.FETCH_APP_CHANGE_LOG_FAIL, payload: {msg: e}});
        }
    };
    this.changeNetworkStatus = (status)=>(dispatch)=> {
        dispatch({type: types.APP_INFO.CHANGE_NETWORK_STATUS, payload: status});
    };
    return Object.assign({}, this);
}]);

