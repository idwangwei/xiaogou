/**
 * Created by ZL on 2018/3/23.
 */
import * as default_states from '../default_states/index';

import {BOOK_TYPE} from '../action_types';

export default (state = default_states.select_book_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case BOOK_TYPE.FETCH_SELECT_BOOK_INFO_SUCCESS:
            nextState = action.playLoad;
            return nextState;
        default:
            return state;
    }
};