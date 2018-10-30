/**
 * Created by ZL on 2017/9/18.
 */
import {ORAL_CALCULATION} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.oral_calculation_limittime, action = null)=>{
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case ORAL_CALCULATION.UPDATE_ORAL_CALCULATION_LIMITTIME:
            if(!nextState[action.payload.paperId]) nextState[action.payload.paperId]={};
            nextState[action.payload.paperId].startTime = action.payload.startTime;
            return nextState;
        case ORAL_CALCULATION.UPDATE_ORAL_CALCULATION_TIMER:
            if(!nextState[action.payload.paperId]) nextState[action.payload.paperId]={};
            nextState[action.payload.paperId].countDownTimer = action.payload.countDownTimer;
            return nextState;
        case ORAL_CALCULATION.DELETE_ORAL_CALCULATION_LIMITTIM:
            delete nextState[action.payload.paperId];
            return nextState;
        default:
            return state;
    }
}