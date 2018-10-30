/**
 * Created by ZL on 2018/2/2.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function current_course_info(state = defaultStates.current_course_info, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP.FETCH_WINTER_CAMP_CURRENT_COURSE_INFO_SUCCESS:
            return action.payload;
        default :
            return state;
    }
}
export default current_course_info;