/**
 * Created by ZL on 2017/12/12.
 */
import * as default_states from '../default_states/index';
import {FINAL_SPRINT_GOODS} from '../action_types';
import lodash_assign from 'lodash.assign';

export default (state = default_states.sprint_goods_created_order_info, action = null)=> {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;

    switch (action.type) {
        //创建订单
        case FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_SUCCESS:
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
        case FINAL_SPRINT_GOODS.CHANGE_SPRINT_GOODS_CREATE_ORDER_STATUS:
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
        case FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_START:
        case FINAL_SPRINT_GOODS.SPRINT_GOODS_CREATE_ORDER_FAIL:
        default:
            return state;
    }
};