/**
 * Created by qiyuexi on 2017/12/20.
 */
import {MICRO_EXAMPLE_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_select_example_item, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_EXAMPLE_LIST.SAVE_SELECT_MICRO_EXAMPLE_ITEM:
            return action.payload;
        case MICRO_EXAMPLE_LIST.MODIFY_SELECT_MICRO_EXAMPLE_ITEM:
            nextState.rightQuestion = action.payload;
            return nextState;
        default:
            return state;
    }
};