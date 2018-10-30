/**
 * Created by ZL on 2017/12/25.
 */
import {MICRO_ALL_QUES_RECORDS} from  "./../action_types/index";
import * as defaultStates from "./../default_states/index";

export default (state=defaultStates.micro_all_ques_records_pagination_info,action=null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type){
        case MICRO_ALL_QUES_RECORDS.CHANGE_ALL_QUES_RECORDS_PAGINATION_INFO:
            let payload = action.payload;
            nextState = {
                pageNum: payload.pageNum, pageSize: payload.pageSize
            };
            return nextState;
        default :
            return state;
    }
};