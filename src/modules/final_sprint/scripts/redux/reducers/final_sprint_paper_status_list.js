/**
 * Created by qiyuexi on 2017/12/18.
 */
import * as default_states from './../default_states/index';
import {STATUS_LIST} from './../action_types/index'
export default (state = default_states.final_sprint_paper_status_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case STATUS_LIST.FETCH_STATUS_LIST_SUCCESS:
            nextState = action.payload;
            return nextState;
        default:
            return state;
    }
}