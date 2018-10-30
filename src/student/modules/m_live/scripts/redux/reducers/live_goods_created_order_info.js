/**
 * Created by ZL on 2017/12/12.
 */
import * as default_states from '../default_states/index';
import {LIVE_GOODS} from '../action_types';
import lodash_assign from 'lodash.assign';

export default (state = default_states.live_goods_created_order_info, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;

    switch (action.type) {
        //创建订单
        case LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_SUCCESS:
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
        case LIVE_GOODS.CHANGE_LIVE_GOODS_CREATE_ORDER_STATUS:
            let orderStatus = {status: payload.status};
            switch (payload.orderType) {
                case "app":
                    nextState.app = lodash_assign(orderStatus, state.app);
                    break;
                case "scan":
                    nextState.scan = lodash_assign(orderStatus, state.scan);
                    break;
            }
            return nextState;
        case LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_START:
        case LIVE_GOODS.LIVE_GOODS_CREATE_ORDER_FAIL:
        default:
            return state;
    }
};