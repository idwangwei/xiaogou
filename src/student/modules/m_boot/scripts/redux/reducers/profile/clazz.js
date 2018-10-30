/**
 * Created by 彭建伦 on 2016/4/18.
 */
import {CLAZZ,PROFILE} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
let profile_clazz = (state = defaultStates.profile_clazz, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        /*我的班级及切换班级*/
        case CLAZZ.FETCH_CLAZZ_LIST_START:
            nextState.isFetchClazzProcessing = true;
            return nextState;
        case CLAZZ.FETCH_CLAZZ_LIST_SUCCESS:
            nextState.isFetchClazzProcessing = false;
            nextState.clazzList = action.clazzList;
            nextState.passClazzList = action.passClazzList;
            nextState.selfStudyClazzList = action.selfStudyClazzList;
            return nextState;
        case CLAZZ.FETCH_CLAZZ_LIST_FAIL:
            nextState.isFetchClazzProcessing = false;
            nextState.errorInfo = action.error;
            return nextState;
        case PROFILE.PROFILE_CHANGE_CLAZZ:
            nextState.selectedClazz = action.clazz;
            return nextState;
        default:
            return state

    }
};
export default profile_clazz;
