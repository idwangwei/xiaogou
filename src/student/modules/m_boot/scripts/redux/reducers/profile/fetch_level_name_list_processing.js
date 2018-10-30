/**
 * Created by Administrator on 2017/5/9.
 */
import * as default_states from './../../default_states/default_states';

import {REWARD_INFO} from '../../actiontypes/actiontypes';

export default (state = default_states.fetch_level_name_list_processing, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case REWARD_INFO.FETCH_LEVEL_NAME_LIST_START:
            return true;
        case REWARD_INFO.FETCH_LEVEL_NAME_LIST_SUCCESS:
            return false;
        case REWARD_INFO.FETCH_LEVEL_NAME_LIST_FAIL:
            return false;
        default:
            return state;
    }
};