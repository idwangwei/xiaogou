/**
 * Created by qiyuexi on 2018/1/3.
 */
import {MICRO_GRADE_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_grade_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_GRADE_LIST.FETCH_MICRO_GRADE_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};