/**
 * Created by ZL on 2017/12/18.
 */
import {MIRCORLECTURE_QUES} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
export default (state=defaultStates.fetch_exam_with_ques_processing,action=null)=>{
    switch (action.type){
        case MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_START:
            return true;
        case MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_SUCCESS:
            return false;
        case MIRCORLECTURE_QUES.FETCH_TINY_CLASS_QUESTION_FAIL:
            return false;
        default:
            return state;
    }
};
