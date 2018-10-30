/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {
    FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS,
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function diagnose_clazz_with_unit(state = defaultStates.diagnose_clazz_with_unit, action = null) {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        case FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS:
            nextState[payload.classId]=payload.selectedUnit;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_clazz_with_unit;