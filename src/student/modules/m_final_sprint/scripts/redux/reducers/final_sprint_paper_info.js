/**
 * Created by qiyuexi on 2017/12/18.
 */
import * as default_states from './../default_states/index';
import {SPRINT_INFO} from './../action_types/index'
export default (state = default_states.final_sprint_paper_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case SPRINT_INFO.FETCH_SPRINT_INFO_SUCCESS:
            nextState = action.payload;
            return nextState;
        default:
            return state;
    }
}