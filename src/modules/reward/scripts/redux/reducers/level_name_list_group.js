/**
 * Created by Administrator on 2017/5/9.
 */
import * as default_states from '../../../../../modules/reward/scripts/redux/default_states/index';

import {CHANGE_LEVEL_NAME} from '../action_types';

export default (state = default_states.level_name_list_group, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case CHANGE_LEVEL_NAME:
            nextState.group = action.payload;
            return nextState;
        default:
            return state;
    }
};