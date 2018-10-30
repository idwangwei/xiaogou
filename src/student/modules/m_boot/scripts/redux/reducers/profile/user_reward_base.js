/**
 * Created by Administrator on 2017/5/9.
 */
import {REWARD_INFO} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
export default (state = defaultStates.user_reward_base, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case REWARD_INFO.GET_USER_REWARD_BASE:
            nextState = Object.assign(nextState, action.payload);
            return nextState;
        case REWARD_INFO.CHANGE_USER_REWARD_BASE:
            nextState.currenLevelName = action.payload.currenLevelName;
            nextState.currenLevelImgIndex = action.payload.currenLevelImgIndex;
            return nextState;
        case REWARD_INFO.UPDATE_USER_REWARD_BASE:
            nextState.avator = action.payload;
            return nextState;
        default:
            return state

    }
};