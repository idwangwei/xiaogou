/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_impeach_reason = (state = default_states.growing_impeach_reason, action = null)=> {
    let impeach_action_type = action_types.GROWING_CLASSMATE_RECORD;
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case impeach_action_type.FETCH_IMPEACH_REASON_LIST_SUCCESS:
            nextState.reasonList = action.payload.reasonList;
            nextState.residueCount = action.payload.count;
            return nextState;
        default:
            return nextState;
    }
};
export default growing_impeach_reason;
