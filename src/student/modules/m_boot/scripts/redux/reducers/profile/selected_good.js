/**
 * Created by 邓小龙 on 2016/12/5.
 */
import {PROFILE} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
let selected_good = (state = defaultStates.selected_good, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case PROFILE.SELECTED_GOOD:
            nextState = action;
            return nextState;
        default:
            return state

    }
};
export default selected_good;
