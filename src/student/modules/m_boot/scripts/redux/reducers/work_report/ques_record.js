/**
 * Created by ZL on 2017/6/2.
 */
// SAVE_WORK_QUES_RECORD
import {WORK_REPORT} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.ques_record, action = null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WORK_REPORT.SAVE_WORK_QUES_RECORD:
            nextState = Object.assign(state,action.payload);
            return nextState;
        default:
            return state;
    }

}