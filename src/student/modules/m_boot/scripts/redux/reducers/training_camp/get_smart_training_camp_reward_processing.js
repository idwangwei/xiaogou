/**
 * Created by WL on 2017/7/7.
 */

import {SMART_TRAINING_CAMP} from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';

let get_smart_training_camp_reward_processing = (state = default_states.get_smart_training_camp_reward_processing, action)=> {
    switch (action.type) {
        case SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_SUCCESS:
            return true;
        case SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_START:
        case SMART_TRAINING_CAMP.GET_SMART_TRAINING_CAMP_REWARD_FAIL:
            return false;
        default:
            return state;
    }
};
export default get_smart_training_camp_reward_processing;