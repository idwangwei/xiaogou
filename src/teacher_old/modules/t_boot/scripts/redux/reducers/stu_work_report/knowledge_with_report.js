/**
 * Created by WL on 2017/6/8.
 */

import {STU_WORK_REPORT} from  './../../action_typs';
import * as defaultStates  from './../../default_states/index';
import _findIndex from 'lodash.findindex';
import lodash_assign from 'lodash.assign';

let knowledge_with_report = (state = defaultStates.knowledge_with_report, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        /* 获取知识点的诊断报告成功*/
        case STU_WORK_REPORT.FETCH_DIAGNOSE_REPORT_SUCCESS:
            let knowledgeReportStoreValue = payload.knowledgeReportStoreValue;
            if (payload.loadMore && knowledgeReportStoreValue.qRecords && knowledgeReportStoreValue.qRecords.length) {
                knowledgeReportStoreValue.qRecords = knowledgeReportStoreValue.qRecords.concat(payload.qRecords);
            } else {
                knowledgeReportStoreValue.qRecords = payload.qRecords;
            }
            knowledgeReportStoreValue.report = payload.report;
            nextState[payload.selectedKnowpoint.knowledgeId]=knowledgeReportStoreValue;
            return nextState;
        default:
            return state;
    }
};
export  default knowledge_with_report;
