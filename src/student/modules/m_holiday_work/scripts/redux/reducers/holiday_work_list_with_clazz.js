/**
 * Created by ww on 2018/1/5.
 */

import {HOLIDAY_WORK} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
import lodash_assign from 'lodash.assign';

export  default (state = defaultStates.holiday_work_list_with_clazz, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        /* 获取假期作业列表成功*/
        case HOLIDAY_WORK.FETCH_HOLIDAY_WORK_LIST_SUCCESS:
            nextState[payload.clzId] = payload.list;
            return nextState;
        default:
            return state;
    }
};