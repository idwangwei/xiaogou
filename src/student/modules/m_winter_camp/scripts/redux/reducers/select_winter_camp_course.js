/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function select_winter_camp_course(state = defaultStates.select_winter_camp_course, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP.SELECT_WINTER_CAMP_COURSE:
            return action.payload;
        default :
            return state;
    }
}
export default select_winter_camp_course;