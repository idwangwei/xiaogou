/**
 * Created by ZL on 2017/6/2.
 */
import {WORK_REPORT} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.select_work_knowledge, action = null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WORK_REPORT.SAVE_SELECT_WORK_KNOWLEDGE:
            nextState = Object.assign(state,action.payload);
            return nextState;
        default:
            return state;
    }

}