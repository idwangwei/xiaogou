/**
 * Created by WL on 2017/6/29.
 */
import * as default_states from '../default_states/index';
import {GAME_GOODS_PAY} from '../action_types';
import lodash_assign from 'lodash.assign';

export default (state = default_states.game_goods_created_order_info, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;

    switch (action.type) {
        //创建订单
        case GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_SUCCESS:
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
        case GAME_GOODS_PAY.CHANGE_GOODS_CREATE_ORDER_STATUS:
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
        case GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_START:
        case GAME_GOODS_PAY.GAME_GOODS_CREATE_ORDER_FAIL:
        default:
            return state;
    }
};