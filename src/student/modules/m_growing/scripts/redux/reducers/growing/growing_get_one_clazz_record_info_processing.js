/**
 * Created by WangLu on 2017/3/1.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_one_clazz_record_info_processing = (state = default_states.growing_one_clazz_record_info_processing, action = null)=> {
    let clazz_action_ype = action_types.GROWING_ONE_CLAZZ;
    switch (action.type) {
        case clazz_action_ype.FETCH_ONE_CLAZZ_INFO_START:
            return true;
        case clazz_action_ype.FETCH_ONE_CLAZZ_INFO_SUCCESS:
        case clazz_action_ype.FETCH_ONE_CLAZZ_INFO_FAIL:
            return false;
        default:
            return state;
    }
};
export default growing_one_clazz_record_info_processing;
