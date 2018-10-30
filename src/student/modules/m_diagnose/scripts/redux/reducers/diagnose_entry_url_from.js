/**
 * Created by ZL on 2018/1/19.
 */
import {DIAGNOSE} from  "../../../../m_boot/scripts/redux/actiontypes/actiontypes";
import * as defaultStates from "../default_states";
import lodash_assign from 'lodash.assign';


function diagnose_entry_url_from(state = defaultStates.diagnose_entry_url_from, action = null) {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        case DIAGNOSE.SAVE_DIAGNOSE_ENTRY_URL_FROM:
            nextState.urlFrom = payload.urlFrom;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_entry_url_from;