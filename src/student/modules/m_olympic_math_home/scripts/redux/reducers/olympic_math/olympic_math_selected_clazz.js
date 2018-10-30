/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {OLYMPIC_MATH} from './../../action_types/index';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function olympic_math_selected_clazz(state = defaultStates.olympic_math_selected_clazz, action = null) {
    switch (action.type) {
        case OLYMPIC_MATH.OLYMPIC_MATH_CHANGE_CLAZZ:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default olympic_math_selected_clazz;