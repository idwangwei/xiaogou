/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_pub_msg_processing = (state = default_states.growing_pub_msg_processing, action = null)=> {
    let pub_msg_action_type = action_types.GROWING_MYSELF_RECORD;
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case pub_msg_action_type.PUB_MSG_START:
            return true;
        case pub_msg_action_type.PUB_MSG_SUCCESS:
        case pub_msg_action_type.PUB_MSG_FAIL:
            return false;
        default:
            return nextState;
    }
};
export default growing_pub_msg_processing;
