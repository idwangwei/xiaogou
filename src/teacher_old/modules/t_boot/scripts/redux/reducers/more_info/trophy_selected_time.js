/**
 * Created by 邓小龙 on 2016/10/18.
 */
import {
    TROPHY_CHANGE_TIME
} from './../../action_typs';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';

function trophy_selected_time(state = defaultStates.trophy_selected_time, action = null) {
    switch (action.type) {
        case TROPHY_CHANGE_TIME:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default trophy_selected_time;