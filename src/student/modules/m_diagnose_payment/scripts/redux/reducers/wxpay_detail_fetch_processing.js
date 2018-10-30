/**
 * Created by ZL on 2017/1/18.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
let wxpay_detail_fetch_processing = (state = defaultStates.wxpay_detail_fetch_processing, action = null)=> {
    switch (action.type) {
        case WEIXIN_PAY.FETCH_PAY_DETAIL_START:
            return true;
        case WEIXIN_PAY.FETCH_PAY_DETAIL_SUCCESS:
        case WEIXIN_PAY.FETCH_PAY_DETAIL_FAIL:
            return false;
        default:
            return state;
    }
};

export default wxpay_detail_fetch_processing;