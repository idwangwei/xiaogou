/**
 * Created by ZL on 2017/7/12.
 */
import {DIAGNOSE_CAMP} from  "./../../actiontypes/actiontypes";
import * as defaultStates from "./../../default_states/default_states";
export default (state = defaultStates.fetch_diagnose_camp_goods_processing, action = null)=> {
    switch (action.type) {
        case DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_START:
            return true;
        case DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_SUCCESS:
        case DIAGNOSE_CAMP.GET_CAMP_GOODS_LIST_FAIL:
            return false;
        default:
            return state;
    }
};
