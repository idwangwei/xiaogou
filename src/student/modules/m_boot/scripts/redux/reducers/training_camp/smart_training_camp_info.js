/**
 * Created by WL on 2017/7/6.
 */

import {SMART_TRAINING_CAMP} from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';

let smart_training_camp_info = (state = default_states.smart_training_camp_info, action)=> {
    let nextState = lodash_assign({}, state);
    switch (action.type) {
        case SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_SUCCESS:
        case SMART_TRAINING_CAMP.CHANGE_SMART_TRAINING_CAMP_INFO:
            nextState = action.payload;
            return nextState;
        case SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_START:
        case SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_FAIL:
        default:
            return nextState;
    }
};
export default smart_training_camp_info;