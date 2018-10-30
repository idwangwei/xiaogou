/**
 * Created by ZL on 2018/2/6.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function winter_camp_share_record(state = defaultStates.winter_camp_share_record, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP.CHANGE_WINTER_CAMP_SHARE_RECORD:
            return true;
        default :
            return state;
    }
}
export default winter_camp_share_record;