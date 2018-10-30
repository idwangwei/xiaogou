/**
 * Created by ZL on 2017/2/17.
 */
import {WEIXIN_PAY} from  "../action_types/index";
import * as defaultStates from "../default_states/index";
import lodash_assign from 'lodash.assign';
let group_buying_created_order_info=(state=defaultStates.wxpay_created_order_info,action=null)=>{
    let nextState = lodash_assign({}, state);
    let payload = action.payload;

    switch (action.type){
        //创建订单
        case WEIXIN_PAY.FETCH_GROUP_BUYING_CREATE_ORDER_SUCCESS:
            let orderMsg = {order:payload.order,orderNo:payload.orderNo};
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
        case WEIXIN_PAY.CHANGE_GROUP_BUYING_ORDER_STATUS:
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

export default group_buying_created_order_info;