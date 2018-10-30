/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_get_myself_record_list_processing = (state = default_states.growing_get_myself_record_list_processing, action = null)=> {
    let myself_action_type = action_types.GROWING_MYSELF_RECORD;
    switch (action.type) {
        case myself_action_type.FETCH_RECORD_LIST_START:
            return true;
        case myself_action_type.FETCH_RECORD_LIST_SUCCESS:
        case myself_action_type.FETCH_RECORD_LIST_FAIL:
            return false;
        default:
            return state;
    }
};
export default growing_get_myself_record_list_processing;
