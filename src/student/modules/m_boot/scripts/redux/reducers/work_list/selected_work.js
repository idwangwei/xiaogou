/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';


function wl_selected_work(state = defaultStates.wl_selected_work, action = null) {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        //*选中作业*/
        case WORK_LIST.WORK_LIST_SELECT_WORK:
            nextState=payload;
            return nextState;
        /* 获取作业状态成功*/
        case WORK_LIST.FETCH_WORK_STATUS_SUCCESS:
            nextState["status"]=payload.status;
            return nextState;
        /* 获取作业状态失败*/
        case WORK_LIST.FETCH_WORK_STATUS_FAILED:
            nextState["failMsg"]=payload.failMsg;
            return nextState;
        default :
            return state;
    }
}
export default wl_selected_work;