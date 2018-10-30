/**
 * Created by 彭建伦 on 2016/4/18.
 */
import * as types from '../actiontypes/actiontypes';
import * as default_profile from './../default_states/default_states';

let profile = (state = default_profile, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        /*登录*/
        case types.PROFILE.LOGIN_START:
            nextState.isLogInProcessing = true;
            return nextState;
        case types.PROFILE.LOGIN_SUCCESS:
            let user = Object.assign({}, action.data);
            nextState.isLogInProcessing = false;
            nextState.user = user;
            nextState.isLogIn = true;
            nextState.role = "S";
            nextState.logoutByUser = false;
            return nextState;
        case types.PROFILE.LOGIN_FAIL:
            nextState.isLogInProcessing = false;
            return nextState;

        /*退出*/
        case types.PROFILE.LOGOUT_START:
            nextState.isLogOutProcessing = true;
            return nextState;
        case types.PROFILE.LOGOUT_SUCCESS:
            nextState.isLogOutProcessing = false;
            nextState.user = {};
            nextState.clazzList = null;
            nextState.isLogIn = false;
            nextState.logoutByUser = true;
            return nextState;
        case types.PROFILE.LOGOUT_FAIL:
            nextState.errorInfo = action.error;
            return nextState;

        /*我的班级及切换班级*/
        case types.CLAZZ.FETCH_CLAZZ_LIST_START:
            nextState.isFetchClazzProcessing = true;
            return nextState;
        case types.CLAZZ.FETCH_CLAZZ_LIST_SUCCESS:
            nextState.isFetchClazzProcessing = false;
            nextState.clazzList = action.clazzList;
            nextState.passClazzList = action.passClazzList;
            return nextState;
        case types.CLAZZ.FETCH_CLAZZ_LIST_FAIL:
            nextState.isFetchClazzProcessing = false;
            nextState.errorInfo = action.error;
            return nextState;
        case  types.PROFILE.PROFILE_CHANGE_CLAZZ:
            nextState.selectedClazz = action.clazz;
            return nextState;
        /*我的成就*/
        case types.ACHIEVEMENT.FETCH_ACHIEVEMENT_START:
            nextState.isFetchAchievementProcessing = true;
            return nextState;
        case types.ACHIEVEMENT.FETCH_ACHIEVEMENT_SUCCESS:
            nextState.isFetchAchievementProcessing = false;
            nextState.achievementList = action.payload;
            return nextState;
        case types.ACHIEVEMENT.FETCH_ACHIEVEMENT_FAIL:
            nextState.isFetchAchievementProcessing = false;
            nextState.errorInfo = action.payload;
            return nextState;

        /*检查session是否有效*/
        case types.PROFILE.CHECK_IS_VALID_SESSION_START:
            return nextState.set('isCheckValidSessionProcessing', true);
        case types.PROFILE.CHECK_IS_VALID_SESSION_SUCCESS:
            return nextState.set('isCheckValidSessionProcessing', false);
        case types.PROFILE.CHECK_IS_VALID_SESSION_FAIL:
            return nextState.set('isCheckValidSessionProcessing', false)
                .set('errorInfo', Immutable.Map(action.payload));
        /*用户主动退出*/
        case types.PROFILE.USER_LOGOUT_BY_SELF:
            nextState.logoutByUser = false;
            nextState.isLogIn = false;
            return nextState;

        case types.PROFILE.SET_LOCAL_STATE_FOR_USER:
            return action.payload.profile;

        case types.PROFILE.SET_DEFAULT_STATE_FOR_USER:
            nextState.clazzList = null;
            nextState.passClazzList = null;
            nextState.achievementList = null;
            nextState.selectedClazz = null;
            nextState.errorInfo = {};
            return nextState;
        default:
            return state

    }
};
export default profile;
