/**
 * Created by WL on 2017/6/6.
 */
import * as default_states from './../../default_states/index';
import {STU_WORK_REPORT} from './../../action_typs';

export  default (state = default_states.fetch_stu_work_report_processing, action = null)=> {
    switch (action.type) {
        case STU_WORK_REPORT.FETCH_DATA_REPORT_START:
            return true;
        case STU_WORK_REPORT.FETCH_DATA_REPORT_FAIL:
        case STU_WORK_REPORT.FETCH_DATA_REPORT_SUCCESS:
            return false;
        default:
            return state;
    }
};