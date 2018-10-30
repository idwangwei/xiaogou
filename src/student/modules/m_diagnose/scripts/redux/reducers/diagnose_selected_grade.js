/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


function diagnose_selected_grade(state = defaultStates.diagnose_selected_grade, action = null) {
    switch (action.type) {
        case DIAGNOSE.DIAGNOSE_CHANGE_GRADE:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default diagnose_selected_grade;