/**
 * Created by ZL on 2017/9/18.
 */
import {FINAL_ACCESS} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.final_access_limittime, action = null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case FINAL_ACCESS.UPDATE_FINAL_ACCESS_LIMITTIME:
            if(!nextState[action.payload.paperId]) nextState[action.payload.paperId]={};
            nextState[action.payload.paperId].startTime = action.payload.startTime;
            return nextState;
        case FINAL_ACCESS.UPDATE_FINAL_ACCESS_TIMER:
            if(!nextState[action.payload.paperId]) nextState[action.payload.paperId]={};
            nextState[action.payload.paperId].countDownTimer = action.payload.countDownTimer;
            return nextState;
        case FINAL_ACCESS.DELETE_FINAL_ACCESS_LIMITTIM:
            delete nextState[action.payload.paperId];
            return nextState;
        default:
            return state;
    }
}