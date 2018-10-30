/**
 * Created by ZL on 2017/12/12.
 */
import * as default_states from './../default_states/index';
import {FINAL_SPRINT_GOODS} from './../action_types/index'
export default (state = default_states.final_sprint_goods_list_processing, action = null)=> {
    switch (action.type) {
        case FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_START:
            return false;
        case FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_SUCCESS:
            return true;
        case FINAL_SPRINT_GOODS.FETCH_SPRINT_GOODS_LIST_FAIL:
            return false;
        default:
            return state;
    }
}
