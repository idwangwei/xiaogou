/**
 * Created by ww on 2018/1/5.
 */

import {HOLIDAY_WORK} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export  default (state = defaultStates.fetch_holiday_work_list_processing, action = null)=> {
    switch (action.type) {
        /* 获取假期作业列表开始*/
        case HOLIDAY_WORK.FETCH_HOLIDAY_WORK_LIST_START:
            return true;
        /* 获取假期作业列表成功*/
        case HOLIDAY_WORK.FETCH_HOLIDAY_WORK_LIST_SUCCESS:
            return false;
        /* 获取假期作业列表失败*/
        case HOLIDAY_WORK.FETCH_HOLIDAY_WORK_LIST_FAIL:
            return false;
        default:
            return state;
    }
};