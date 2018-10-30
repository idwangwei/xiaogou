/**
 * Created by qiyuexi on 2017/12/28.
 */
import {MICRO_VIP_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_pay_back_url, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_VIP_LIST.SAVE_MICRO_PAY_BACK_URL:
            return action.payload;
        default:
            return state;
    }
};