import * as default_states from './../../default_states/index';

import {
    PROFILE_LOGIN_START
    ,PROFILE_LOGIN_SUCCESS
    ,PROFILE_LOGIN_FAIL
} from './../../action_typs';

export  default (state = default_states.profile_login_processing, action = null)=> {
    switch (action.type) {
        case PROFILE_LOGIN_START:
            return true;
        case PROFILE_LOGIN_SUCCESS:
        case PROFILE_LOGIN_FAIL:
            return false;
        default:
            return state;
    }
};
