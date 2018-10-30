/**
 * Created by Administrator on 2017/3/3.
 */
import {WEIXIN_PAY} from  "./../../action_types/index";
import * as defaultStates from "./../../default_states/index";
import lodash_assign from 'lodash.assign';


function mo_goods_menus_list(state = defaultStates.mo_goods_menus_list, action = null) {
    switch (action.type) {
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_GOODS_SUCCESS:
            return lodash_assign({}, action.payload);
        default :
            return state;
    }
}
export default mo_goods_menus_list;