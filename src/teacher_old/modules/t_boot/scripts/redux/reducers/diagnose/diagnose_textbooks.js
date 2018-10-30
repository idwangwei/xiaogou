/**
 * Created by 邓小龙 on 2016/10/13.
 */
import {
    FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function diagnose_textbooks(state = defaultStates.diagnose_textbooks, action = null) {
    let nextState=Object.assign({},state);
    switch (action.type) {
        case FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS:
            nextState=action.payload;
            return nextState;
        default :
            return state;
    }
}
export default diagnose_textbooks;