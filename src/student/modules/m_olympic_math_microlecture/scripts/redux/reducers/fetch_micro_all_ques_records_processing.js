/**
 * Created by ZL on 2017/12/25.
 */
import {MICRO_ALL_QUES_RECORDS} from  "./../action_types/index";
import * as defaultStates from "./../default_states/index";
export default (state=defaultStates.fetch_micro_all_ques_records_processing,action=null)=>{
    switch (action.type){
        case MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_START:
            return true;
        case MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_SUCCESS:
            return false;
        case MICRO_ALL_QUES_RECORDS.FETCH_ALL_QUES_RECORDS_REPORT_FAIL:
            return false;
        default:
            return state;
    }
};