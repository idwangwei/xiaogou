/**
 * Created by qiyuexi on 2017/12/20.
 */
import {MICRO_UNIT_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_select_unit_item, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_UNIT_LIST.SAVE_SELECT_MICRO_UNIT_ITEM:
            return action.payload;
        default:
            return state;
    }
};