/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


function diagnose_goods_menus_list(state = defaultStates.diagnose_goods_menus_list, action = null) {
    switch (action.type) {
        case DIAGNOSE.FETCH_GOODS_MENUS_SUCCESS:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default diagnose_goods_menus_list;