import * as default_states from './../default_states/index';
import {TEACHER_SHARE
} from './../action_typs';
import _assign from 'lodash.assign';


export  default (state=default_states.teacher_share_info,action=null)=>{
    let nextState = _assign({},state);

    switch (action.type) {
        case TEACHER_SHARE.FETCH_DATA_SUCCESS:
            nextState = action.payload;
            if(action.payload.detail){
                nextState.shareInfoDetail = action.payload.detail;
            }
            if(action.payload.vipTime){
                nextState.mineStuVipTime = action.payload.vipTime;
            }
            if(action.payload.flowStep && action.payload.flowStep > nextState.flowStep){
                nextState.flowStep = action.payload.flowStep;
            }

            return nextState;
        case TEACHER_SHARE:
        default:
            return state;
    }

};
