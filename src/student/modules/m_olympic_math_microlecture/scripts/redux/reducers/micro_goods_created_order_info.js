/**
 * Created by qiyuexi on 2017/12/27.
 */
import * as default_states from '../default_states/index';
import {MICRO_VIP_LIST} from '../action_types';

export default (state = default_states.micro_goods_created_order_info, action = null)=> {
    let nextState = Object.assign({}, state);
    let payload = action.payload;

    switch (action.type) {
        //创建订单
        case MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_SUCCESS:
            let orderMsg = {order: payload.order, orderNo: payload.orderNo, productId: payload.productId};
            switch (payload.orderType) {
                case "app":
                    nextState.app = orderMsg;
                    break;
                case "scan":
                    nextState.scan = orderMsg;
                    break;
            }
            return nextState;
        //修改订单状态
        case MICRO_VIP_LIST.CHANGE_MICRO_GOODS_CREATE_ORDER_STATUS:
            let orderStatus = {status: payload.status};
            switch (payload.orderType) {
                case "app":
                    nextState.app = Object.assign(orderStatus, state.app);
                    break;
                case "scan":
                    nextState.scan = Object.assign(orderStatus, state.scan);
                    break;
            }
            return nextState;
        case MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_START:
        case MICRO_VIP_LIST.MICRO_GOODS_CREATE_ORDER_FAIL:
        default:
            return state;
    }
};