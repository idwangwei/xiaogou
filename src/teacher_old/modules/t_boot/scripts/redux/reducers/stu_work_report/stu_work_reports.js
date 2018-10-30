/**
 * Created by WL on 2017/6/6.
 */

import * as default_states from './../../default_states/index';
import {STU_WORK_REPORT} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state = default_states.stu_work_report, action = null)=> {
    switch (action.type) {
        case STU_WORK_REPORT.FETCH_DATA_REPORT_START:
        case STU_WORK_REPORT.FETCH_DATA_REPORT_FAIL:
            return state;
        case STU_WORK_REPORT.FETCH_DATA_REPORT_SUCCESS:
            let newState = _assign({},state);
            newState[action.payload.paperInstanceId] = action.payload.result;
            return newState;
        default:
            return state;
    }
};
