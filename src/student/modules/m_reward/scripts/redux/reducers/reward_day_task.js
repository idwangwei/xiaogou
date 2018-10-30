/**
 * Created by Administrator on 2017/5/8.
 */
import * as default_states from '../default_states/index';

import {FETCH_DAY_TASK_INFO} from '../action_types';

export default (state = default_states.reward_day_task, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FETCH_DAY_TASK_INFO:
            /* let date = new Date();
             let dateStr = ""+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDay();
             nextState.date = dateStr;*/
            return action.payload;
        default:
            return state;
    }
};