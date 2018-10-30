/**
 * Created by WangLu on 2016/9/30.
 */
import * as default_states from './../../default_states/index';
import _assign from 'lodash.assign';

import {
    CHANGE_SELECT_CLAZZ_DETAIL_START
    ,CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS
    ,CHANGE_SELECT_CLAZZ_DETAIL_FAIL
    ,CHANGE_CLAZZ_INFO_START
    ,CHANGE_CLAZZ_INFO_SUCCESS
    ,CHANGE_CLAZZ_INFO_FAIL
} from './../../action_typs';

export  default (state = default_states.cm_select_clazz_info, action = null)=> {
    let nextState = _assign({},state);
    switch (action.type) {
        case CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS:
        case CHANGE_CLAZZ_INFO_SUCCESS:
             nextState = action.payload;
            return nextState;
        case CHANGE_SELECT_CLAZZ_DETAIL_START:
        case CHANGE_SELECT_CLAZZ_DETAIL_FAIL:
        case CHANGE_CLAZZ_INFO_START:
        case CHANGE_CLAZZ_INFO_FAIL:
            return state;
        default:
            return state;
    }
};