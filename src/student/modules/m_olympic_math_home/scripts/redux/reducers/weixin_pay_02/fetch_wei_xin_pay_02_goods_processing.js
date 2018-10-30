/**
 * Created by ZL on 2017/3/3.
 */
import {WEIXIN_PAY} from  "./../../action_types/index";
import * as defaultStates from "./../../default_states/index";
let fetch_wei_xin_pay_02_goods_processing = (state = defaultStates.fetch_wei_xin_pay_02_goods_processing, action = null)=> {
    switch (action.type) {
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_START:
            return true;
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_SUCCESS:
            return true;
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_FAIL:
            return false;
        default:
            return state;
    }
};

export default fetch_wei_xin_pay_02_goods_processing;