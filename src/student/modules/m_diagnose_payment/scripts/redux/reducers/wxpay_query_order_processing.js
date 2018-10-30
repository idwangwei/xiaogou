/**
 * Created by WangLu on 2016/12/5.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
let wxpay_query_order_processing=(state=defaultStates.wxpay_query_order_processing,action=null)=>{
    switch (action.type){
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_START:
            return true;
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_SUCCESS:
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_QUERY_ORDER_FAIL:
            return false;
        default:
            return state;
    }
};

export default wxpay_query_order_processing;