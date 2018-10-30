/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_selected_clazz = (state = default_states.growing_selected_clazz, action = null)=> {
    let classmate_list_action_type = action_types.GROWING_CLASSMATE_LIST;
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case classmate_list_action_type.CHANGE_SELECT_CLAZZ:
            nextState = action.payload;
            return nextState;
        default:
            return nextState;
    }
};
export default growing_selected_clazz;
