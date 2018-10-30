/**
 * Created by ZL on 2017/6/1.
 */
import {WORK_REPORT} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.work_report_info, action = null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WORK_REPORT.GET_WORK_REPORT_INFO:
            nextState = Object.assign(state,action.payload);
            return nextState;
        case WORK_REPORT.CHANGE_WORK_REPORT_PAPER_INFO:
            nextState = Object.assign(state,action.payload);
            return nextState;
        default:
            return state;
    }

}