/**
 * Created by ZL on 2017/3/3.
 */
import {WEIXIN_PAY} from  "./../../action_types/index";
import * as defaultStates from "./../../default_states/index";
import lodash_assign from 'lodash.assign';

let wei_xin_pay_02_created_order_info = (state = defaultStates.wei_xin_pay_02_created_order_info, action = null)=> {
   /* switch (action.type) {
        //创建订单
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_CREATE_ORDER_SUCCESS:
            return lodash_assign({}, action.payload);
        //修改订单状态
        case WEIXIN_PAY.CHANGE_WEI_XIN_PAY_02_ORDER_STATUS:
            let nextState = lodash_assign({}, state);
            nextState.payType = action.payload.status;

            return nextState;
        default:
            return state;
    }*/
    let nextState = lodash_assign({}, state);
    let payload = action.payload;

    switch (action.type){
        //创建订单
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_02_CREATE_ORDER_SUCCESS:
            let orderMsg = {order:payload.order,orderNo:payload.orderNo,productId:payload.productId};
            switch(payload.orderType){
                case "app":
                    nextState.app = orderMsg;
                    break;
                case "scan":
                    nextState.scan = orderMsg;
                    break;
            }
            return nextState;
        //修改订单状态
        case WEIXIN_PAY.CHANGE_WEI_XIN_PAY_02_ORDER_STATUS:
            var orderStatus = {status:payload.status};
            switch(payload.orderType){
                case "app":
                    nextState.app = lodash_assign(orderStatus, state.app);
                    break;
                case "scan":
                    nextState.scan = lodash_assign(orderStatus, state.scan);
                    break;
            }
            return nextState;
        default:
            return state;
    }
};

export default wei_xin_pay_02_created_order_info;