/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP_VIP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


export default (state = defaultStates.winter_camp_vip, action = null) => {
    let nextState = lodash_assign({}, state);
    switch (action.type) {
        case WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_START:
            nextState.fetch_goods_list_processing = true;
            return nextState;
        case WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_SUCCESS:
            nextState.goods_list = action.payload;
            nextState.fetch_goods_list_processing = false;
            return nextState;
        case WINTER_CAMP_VIP.FETCH_VIP_GOODS_LIST_FAIL:
            nextState.fetch_goods_list_processing = false;
            return nextState;

        case WINTER_CAMP_VIP.CHANGE_WINTER_CAMP_VIP_SELECT_GOODS:
            nextState.select_goods = action.payload;
            return nextState;

        case WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_START:
            nextState.create_order_processing = true;
            return nextState;
        case WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_FAIL:
            nextState.create_order_processing = false;
            return nextState;
        case WINTER_CAMP_VIP.WINTER_CAMP_GOODS_CREATE_ORDER_SUCCESS:
            nextState.create_order_processing = false;
            let orderInfo = {order: action.payload.order, orderNo: action.payload.orderNo, productId: action.payload.productId};
            nextState.created_order_info[action.payload.orderType] = orderInfo;
            return nextState;

        case WINTER_CAMP_VIP.CHANGE_WINTER_CAMP_GOODS_CREATE_ORDER_STATUS:
            let orderStatus = {status: action.payload.status};
            nextState.created_order_info[action.payload.orderType] = lodash_assign(orderStatus, state.created_order_info[action.payload.orderType]);
            return nextState;

        default :
            return state;
    }
}
