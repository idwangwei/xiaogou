/**
 * Created by WangLu on 2016/12/5.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
import lodash_assign from 'lodash.assign';
let wxpay_created_order_info=(state=defaultStates.wxpay_created_order_info,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;

    switch (action.type){
        //创建订单
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_SUCCESS:
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
        case WEIXIN_PAY.CHANGE_WEI_XIN_PAY_ORDER_STATUS:
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
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_FAIL:
        case WEIXIN_PAY.FETCH_WEI_XIN_PAY_CREATE_ORDER_START:
        default:
            return state;
    }
};

export default wxpay_created_order_info;