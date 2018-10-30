/**
 * Created by ww on 2018/1/5.
 */

import {QUESTION_EVERY_DAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
import lodash_assign from 'lodash.assign';

export  default (state = defaultStates.question_every_day_list_with_clazz, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        /* 获取每日一题作业列表成功*/
        case QUESTION_EVERY_DAY.FETCH_QUESTION_EVERY_DAY_LIST_SUCCESS:
            nextState[payload.clzId] = payload.list;
            return nextState;
        default:
            return state;
    }
};