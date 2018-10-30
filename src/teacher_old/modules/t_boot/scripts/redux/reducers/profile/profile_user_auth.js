/**
 * Created by 彭建伦 on 2016/4/18.
 */
import {
    PROFILE_LOGIN_START
    , PROFILE_LOGIN_SUCCESS
    , PROFILE_LOGIN_FAIL
    , PROFILE_LOGOUT_START
    , PROFILE_LOGOUT_SUCCESS
    , PROFILE_LOGOUT_FAIL
    , PROFILE_CHECK_IS_VALID_SESSION_START
    , PROFILE_CHECK_IS_VALID_SESSION_SUCCESS
    , PROFILE_CHECK_IS_VALID_SESSION_FAIL
    , PROFILE_USER_LOGOUT_BY_SELF
    , SET_TEACHER_BASE_INFO
    , CHANGE_TEACHER_RELEVANCE_CELLPHONE
    , MODIFY_USER_VISITOR
} from './../../action_typs';
import * as default_states from './../../default_states/index';
let profile_user_auth = (state = default_states.profile_user_auth, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        /*登录*/
        case PROFILE_LOGIN_START:
            nextState.isLogInProcessing = true;
            return nextState;
        case PROFILE_LOGIN_SUCCESS:
            let user = Object.assign({}, action.data);
            nextState.isLogInProcessing = false;
            nextState.user = user;
            nextState.isLogIn = true;
            nextState.role = "T";
            nextState.logoutByUser = false;
            return nextState;
        case PROFILE_LOGIN_FAIL:
            nextState.isLogIn = false;
            nextState.isLogInProcessing = false;
            return nextState;

        /*退出*/
        case PROFILE_LOGOUT_START:
            nextState.isLogOutProcessing = true;
            return nextState;
        case PROFILE_LOGOUT_SUCCESS:
            nextState.isLogOutProcessing = false;
            nextState.user = {};
            nextState.isLogIn = false;
            nextState.logoutByUser = true;
            return nextState;
        case PROFILE_LOGOUT_FAIL:
            nextState.errorInfo = action.error;
            return nextState;
        /*检查session是否有效*/
        case PROFILE_CHECK_IS_VALID_SESSION_START:
            return nextState.set('isCheckValidSessionProcessing', true);
        case PROFILE_CHECK_IS_VALID_SESSION_SUCCESS:
            return nextState.set('isCheckValidSessionProcessing', false);
        case PROFILE_CHECK_IS_VALID_SESSION_FAIL:
            return nextState.set('isCheckValidSessionProcessing', false)
                .set('errorInfo', Immutable.Map(action.payload));
        /*用户主动退出*/
        case PROFILE_USER_LOGOUT_BY_SELF:
            nextState.logoutByUser = true;
            nextState.isLogIn = false;
            return nextState;
        /*个人中心用户信息修改*/
        case SET_TEACHER_BASE_INFO:
            nextState.user.name = action.payload.name;
            nextState.user.gender = action.payload.gender;
            return nextState;
        case CHANGE_TEACHER_RELEVANCE_CELLPHONE:
            nextState.user.telephone = action.payload.telephone;
            return nextState;
        case MODIFY_USER_VISITOR:
            nextState.user.visitor = action.payload.visitor;
            return nextState;
        default:
            return state

    }
};
export default profile_user_auth;
