/**
 * Created by ZL on 2018/1/30.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function winter_camp_selected_grade(state = defaultStates.winter_camp_selected_grade, action = null) {
    switch (action.type) {
        case WINTER_CAMP.WINTER_CAMP_SELECTED_GRADE:
            return lodash_assign({}, state, action.payload);
        case WINTER_CAMP.CHANGE_WINTER_CAMP_SELECTED_GRADE_FLAG:
            return lodash_assign({}, state, action.payload);
        default :
            return state;
    }
}
export default winter_camp_selected_grade;