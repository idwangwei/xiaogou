/**
 * Created by 邓小龙 on 2016/8/12.
 */

import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';

let knowledge_with_report = (state = defaultStates.knowledge_with_report, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        /* 获取知识点的诊断报告成功*/
        case DIAGNOSE.FETCH_DIAGNOSE_REPORT_SUCCESS:
            let knowledgeReportStoreValue = payload.knowledgeReportStoreValue;
            if (payload.loadMore && knowledgeReportStoreValue.qRecords && knowledgeReportStoreValue.qRecords.length) {
                knowledgeReportStoreValue.qRecords = knowledgeReportStoreValue.qRecords.concat(payload.qRecords);
            } else {
                knowledgeReportStoreValue.qRecords = payload.qRecords;
            }
            knowledgeReportStoreValue.report = payload.report;
            nextState[payload.selectedKnowpoint.knowledgeId]=knowledgeReportStoreValue;
            return nextState;
        case DIAGNOSE.SUBTRACT_DIAGNOSE_REPORT_WRONG_NUM:
            let currentReport = nextState[payload.knowledgeId].report;
            if(currentReport && currentReport.wrongNum){
                currentReport.wrongNum--;
            }
            return nextState;
        default:
            return state;
    }
};
export  default knowledge_with_report;
