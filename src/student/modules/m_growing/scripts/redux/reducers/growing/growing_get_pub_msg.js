/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_get_pub_msg = (state = default_states.growing_get_pub_msg, action = null)=> {
    let pub_action_types = action_types.GROWING_PUB_MSG;
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case pub_action_types.FETCH_STATUS_LIST_SUCCESS:
            nextState.statusList = action.payload;
            return nextState;
        case pub_action_types.FETCH_LABEL_LIST_SUCCESS:
            nextState.labelList = action.payload;
            return nextState;
        case pub_action_types.FETCH_TYPE_LIST_SUCCESS:
            nextState.typeList = action.payload;
            return nextState;
        default:
            return nextState;
    }
};
export default growing_get_pub_msg;
