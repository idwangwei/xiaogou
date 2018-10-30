/**
 * Created by ZL on 2017/2/14.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
let group_buying_goods_list_fetch_processing = (state = defaultStates.group_buying_goods_list_fetch_processing, action = null)=> {
    switch (action.type) {
        case WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_START:
            return true;
        case WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_SUCCESS:
        case WEIXIN_PAY.FETCH_GROUP_BUYING_GOODS_MENUS_FAIL:
            return false;
        default:
            return state;
    }
};

export default group_buying_goods_list_fetch_processing;