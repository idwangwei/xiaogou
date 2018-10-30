/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_get_impeach_reason_processing = (state = default_states.growing_get_impeach_reason_processing, action = null)=> {
    let impeach_action_type = action_types.GROWING_CLASSMATE_RECORD;
    switch (action.type) {
        case impeach_action_type.FETCH_IMPEACH_REASON_LIST_START:
            return true;
        case impeach_action_type.FETCH_IMPEACH_REASON_LIST_FAIL:
        case impeach_action_type.FETCH_IMPEACH_REASON_LIST_SUCCESS:
            return false;
        default:
            return state;
    }
};
export default growing_get_impeach_reason_processing;
