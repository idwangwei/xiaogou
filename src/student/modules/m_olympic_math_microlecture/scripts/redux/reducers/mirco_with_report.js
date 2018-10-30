/**
 * Created by ZL on 2017/12/25.
 */
import {MICRO_ALL_QUES_RECORDS} from  "./../action_types/index";
import * as defaultStates from "./../default_states/index";
import lodash_assign from 'lodash.assign';

export default (state = defaultStates.mirco_with_report, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        /* 获取知识点的诊断报告成功*/
        case MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_SUCCESS:
            let examSelectPoint = payload.examSelectPoint;
            if (payload.loadMore && examSelectPoint.qRecords && examSelectPoint.qRecords.length) {
                examSelectPoint.qRecords = examSelectPoint.qRecords.concat(payload.qRecords);
            } else {
                examSelectPoint.qRecords = payload.qRecords;
            }
            examSelectPoint.report = payload.report;
            nextState[payload.examSelectPoint.groupId]=examSelectPoint;
            return nextState;
        default:
            return state;
    }
};