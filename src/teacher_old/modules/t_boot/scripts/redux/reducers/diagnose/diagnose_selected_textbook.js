/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {
    SELECT_DIAGNOSE_TEXTBOOK_WORK
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function diagnose_selected_textbook(state = defaultStates.diagnose_selected_textbook, action = null) {
    let nextState=Object.assign({},state);
    switch (action.type) {
        case SELECT_DIAGNOSE_TEXTBOOK_WORK:
            nextState[action.payload.clazzId]=action.payload.textbook;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_selected_textbook;