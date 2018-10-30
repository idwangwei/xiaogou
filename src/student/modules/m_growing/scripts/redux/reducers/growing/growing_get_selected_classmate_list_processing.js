/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_get_selected_classmate_list_processing = (state = default_states.growing_get_selected_classmate_list_processing, action = null)=> {
    let classmate_list_action_type = action_types.GROWING_CLASSMATE_LIST;
    switch (action.type) {
        case classmate_list_action_type.FETCH_RECORD_LIST_START:
            return true;
        case classmate_list_action_type.FETCH_RECORD_LIST_SUCCESS:
        case classmate_list_action_type.FETCH_RECORD_LIST_FAIL:
            return false;
        default:
            return state;
    }
};
export default growing_get_selected_classmate_list_processing;
