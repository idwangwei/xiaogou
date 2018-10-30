/**
 * Created by ZL on 2017/1/18.
 */
import * as types from  "../action_types/index";
import * as default_states from "../default_states/index";
let wxpay_detail_list = (state = default_states.wxpay_detail_list, action)=> {
    switch (action.type) {
        case (types.WEIXIN_PAY.SAVE_PAY_DETAIL):
            return Object.assign({}, state, {list: action.payload});
        default:
            return state;
    }
};
export default wxpay_detail_list;