/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {
    CHANGE_DIAGNOSE_UNIT
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function diagnose_selected_unit(state = defaultStates.diagnose_selected_unit, action = null) {
    let nextState=Object.assign({},state);
    switch (action.type) {
        case CHANGE_DIAGNOSE_UNIT:
            nextState=action.unit;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_selected_unit;