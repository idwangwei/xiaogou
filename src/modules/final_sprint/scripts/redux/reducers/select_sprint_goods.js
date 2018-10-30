/**
 * Created by ZL on 2017/12/12.
 */
import * as default_states from './../default_states/index';
import {FINAL_SPRINT_GOODS} from './../action_types/index'
export default (state = default_states.select_sprint_goods, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FINAL_SPRINT_GOODS.SELECT_SPRINT_GOODS:
            nextState = action.payload;
            return nextState;
        default:
            return state;
    }
}