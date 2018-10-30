/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


function increase_score_goods_menus_list(state = defaultStates.increase_score_goods_menus_list, action = null) {
    switch (action.type) {
        case DIAGNOSE.FETCH_INCREASE_SCORE_GOODS_MENUS_SUCCESS:
            return action.payload;
        default :
            return state;
    }
}
export default increase_score_goods_menus_list;