/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function winter_camp_all_courses(state = defaultStates.winter_camp_all_courses, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP.FETCH_WINTER_CAMP_ALL_COURSES_SUCCESS:
            nextState.courseList = action.payload;
            return nextState;
        default :
            return state;
    }
}
export default winter_camp_all_courses;