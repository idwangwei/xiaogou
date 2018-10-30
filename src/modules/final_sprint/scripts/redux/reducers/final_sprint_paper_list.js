/**
 * Created by qiyuexi on 2017/12/14.
 */
import * as default_states from './../default_states/index';
import {PAPER_LIST} from './../action_types/index'
export default (state = default_states.final_sprint_paper_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case PAPER_LIST.FETCH_PAPER_LIST_SUCCESS:
            nextState = action.payload;
            return nextState;
        default:
            return state;
    }
}