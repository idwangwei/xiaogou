/**
 * Created by ZL on 2017/11/10.
 */
import * as default_states from '../default_states/index';
import {CREDITS_GOODS} from '../action_types';

export default (state = default_states.credits_goods_list_processing, action = null)=> {
    switch (action.type) {
        case CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_START:
            return false;
        case CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_FAIL:
            return false;
        case CREDITS_GOODS.FETCH_CREDITS_GOODS_LIST_SUCCESS:
            return true;
        default:
            return state;
    }
};