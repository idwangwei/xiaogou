/**
 * Created by qiyuexi on 2017/12/27.
 */
import {MICRO_VIP_LIST} from  "../action_types/index";
import * as defaultStates from "../default_states/index";

export default (state = defaultStates.micro_vip_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case MICRO_VIP_LIST.FETCH_MICRO_GOODS_LIST_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};