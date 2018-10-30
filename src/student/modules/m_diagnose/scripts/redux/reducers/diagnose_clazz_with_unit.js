/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


function diagnose_clazz_with_unit(state = defaultStates.diagnose_clazz_with_unit, action = null) {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        case DIAGNOSE.FETCH_UNIT_STATISTIC_SUCCESS:
            nextState[payload.classId]=payload.selectedUnit;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_clazz_with_unit;