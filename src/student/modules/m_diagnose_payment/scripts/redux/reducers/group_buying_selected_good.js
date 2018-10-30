/**
 * Created by ZL on 2017/2/17.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
let group_buying_selected_good = (state = defaultStates.group_buying_selected_good, action = null)=> {
    let nextState = Object.assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        case WEIXIN_PAY.SAVE_GROUP_BUYING_GOODS:
            nextState = action;
            return nextState;
        case WEIXIN_PAY.FETCH_GROUP_BUYING_CREATE_ORDER_SUCCESS:
            let orderMsg = {order: payload.order, orderNo: payload.orderNo};
            nextState.order = orderMsg;
            return nextState;
        default:
            return state

    }
};
export default group_buying_selected_good;
