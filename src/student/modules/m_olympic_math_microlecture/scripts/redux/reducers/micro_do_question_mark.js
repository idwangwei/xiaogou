/**
 * Created by qiyuexi on 2018/2/8.
 */
import {MICRO_DO_QUESTION_MARK} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_do_question_mark, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_DO_QUESTION_MARK:
            return action.payload;
        default:
            return state;
    }
};