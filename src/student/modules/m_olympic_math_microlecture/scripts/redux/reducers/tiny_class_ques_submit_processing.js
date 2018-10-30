/**
 * Created by ZL on 2017/12/18.
 */
import {MIRCORLECTURE_QUES} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
export default (state=defaultStates.tiny_class_ques_submit_processing,action=null)=>{
    switch (action.type){
        case MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_START:
            return true;
        case MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_SUCCESS:
            return false;
        case MIRCORLECTURE_QUES.TINY_CLASS_DIAGNOSE_SUBMIT_QUES_FAIL:
            return false;
        default:
            return state;
    }
};
