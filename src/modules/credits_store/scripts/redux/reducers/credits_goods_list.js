/**
 * Created by ZL on 2017/11/10.
 */
import * as default_states from '../default_states/index';

import {CREDITS_GOODS} from '../action_types';

export default (state = default_states.credits_goods_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_SUCCESS:
            nextState.hotSellGoods = action.payload.hotSellGoods;
            nextState.goods = action.payload.goods;
            nextState.count = action.payload.count;
            nextState.lastKey = action.payload.lastKey;
            return nextState;
        case CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_MORE:
            if(action.payload.goods&&action.payload.goods.length>0)
            nextState.goods.push(action.payload.goods);
            nextState.count = action.payload.count;
            nextState.lastKey = action.payload.lastKey;
            return nextState;
        default:
            return state;
    }
};