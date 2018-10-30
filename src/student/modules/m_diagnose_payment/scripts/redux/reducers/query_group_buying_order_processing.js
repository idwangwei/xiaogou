/**
 * Created by ZL on 2017/2/20.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
let query_group_buying_order_processing = (state = defaultStates.query_group_buying_order_processing, action = null)=> {
    switch (action.type) {
        case WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_START:
            return true;
        case WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_SUCCESS:
        case WEIXIN_PAY.FETCH_GROUP_BUYING_ORDER_FAIL:
            return false;
        default:
            return state;
    }
};

export default query_group_buying_order_processing;