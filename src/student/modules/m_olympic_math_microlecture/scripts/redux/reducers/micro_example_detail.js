/**
 * Created by qiyuexi on 2017/12/20.
 */
import {MICRO_EXAMPLE_DETAIL} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_example_detail, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_EXAMPLE_DETAIL.FETCH_MICRO_EXAMPLE_DETAIL_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};