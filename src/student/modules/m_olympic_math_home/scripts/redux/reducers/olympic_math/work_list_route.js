/**
 * Created by 邓小龙 on 2017/03/10.
 */
import {OLYMPIC_MATH} from './../../action_types/index';
import * as defaultStates from './../../default_states/index';
import lodash_assign from 'lodash.assign';


function work_list_route(state = defaultStates.work_list_route, action = null) {
    switch (action.type) {
        case OLYMPIC_MATH.CHANGE_WORK_LIST_URL_FROM:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default work_list_route;