/**
 * Created by 彭建伦 on 2016/6/15.
 */
import {WORK_LIST} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';


function wl_selected_clazz(state = defaultStates.wl_selected_clazz, action = null) {
    switch (action.type) {
        case WORK_LIST.WORK_LIST_CHANGE_CLAZZ:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default wl_selected_clazz;