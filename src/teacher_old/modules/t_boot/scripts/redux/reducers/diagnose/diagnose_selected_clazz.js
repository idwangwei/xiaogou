/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {
    CHANGE_DIAGNOSE_CLAZZ
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function diagnose_selected_clazz(state = defaultStates.diagnose_selected_clazz, action = null) {
    switch (action.type) {
        case CHANGE_DIAGNOSE_CLAZZ:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default diagnose_selected_clazz;