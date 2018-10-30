/**
 * Created by qiyuexi on 2017/12/20.
 */
import {MICRO_UNIT_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_unit_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_UNIT_LIST.FETCH_MICRO_UNIT_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};