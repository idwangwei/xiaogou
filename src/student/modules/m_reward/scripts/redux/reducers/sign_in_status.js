/**
 * Created by Administrator on 2017/5/4.
 */
import * as default_states from '../default_states/index';

import {CHANGE_SIGN_IN_DATE} from '../action_types';

export default (state = default_states.sign_in_status, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case CHANGE_SIGN_IN_DATE:
            let date = new Date();
            let userName = action.payload;
            let dateStr = ""+userName+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            nextState.date = dateStr;
            return nextState;
        default:
            return state;
    }
};