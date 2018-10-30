/**
 * Created by ww on 2018/1/5.
 */

import {QUESTION_EVERY_DAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export  default (state = defaultStates.fetch_question_every_day_list_processing, action = null)=> {
    switch (action.type) {
        /* 获取每日一题作业列表开始*/
        case QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_START:
            return true;
        /* 获取每日一题作业列表成功*/
        case QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_SUCCESS:
            return false;
        /* 获取每日一题作业列表失败*/
        case QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_FAIL:
            return false;
        default:
            return state;
    }
};