/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_selected_classmate_list = (state = default_states.growing_selected_classmate_list, action = null)=> {
    let classmate_list_action_type = action_types.GROWING_CLASSMATE_LIST;
    switch (action.type) {
        case classmate_list_action_type.FETCH_CLASSMATE_LIST_SUCCESS:
            let nextState = action.payload;
            return nextState;
        default:
            return state;
    }
};
export default growing_selected_classmate_list;
