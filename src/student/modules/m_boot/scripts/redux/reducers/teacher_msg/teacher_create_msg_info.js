/**
 * Created by ZL on 2017/8/31.
 */
import {CLAZZ} from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';

export default (state = default_states.teacher_create_msg_info, action)=> {
    let nextState = lodash_assign({}, state);
    switch (action.type) {
        case CLAZZ.SAVE_TEACHER_MSG:
            nextState.createTime = action.payload;
        default:
            return nextState;
    }
};