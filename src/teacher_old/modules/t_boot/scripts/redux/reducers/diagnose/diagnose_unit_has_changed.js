/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {
    CHANGE_DIAGNOSE_UNIT,
    RESET_DIAGNOSE_UNIT_STATUS
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function diagnose_unit_has_changed(state = defaultStates.diagnose_unit_has_changed, action = null) {
    let nextState=Object.assign({},state);
    switch (action.type) {
        case CHANGE_DIAGNOSE_UNIT:
            nextState=true;
            return nextState;
        case RESET_DIAGNOSE_UNIT_STATUS:
            nextState=false;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_unit_has_changed;