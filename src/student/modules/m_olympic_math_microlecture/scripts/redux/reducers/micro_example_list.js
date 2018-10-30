/**
 * Created by qiyuexi on 2017/12/20.
 */
import {MICRO_EXAMPLE_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_example_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_EXAMPLE_LIST.FETCH_MICRO_EXAMPLE_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};