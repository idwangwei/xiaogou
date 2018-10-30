/**
 * Created by Administrator on 2017/9/27.
 */
import * as default_states from './../../default_states/default_states';
import {PROFILE} from '../../actiontypes/actiontypes';
export default (state = default_states.profile_show_flag, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case PROFILE.MODIFY_DURING_NATIONAL_DAY_FLAG:
            nextState.is_during_national_day = !!(action.data && action.data.isNationalDay);
            // nextState.is_during_national_day = true;
            return nextState;
        case PROFILE.CLICK_NATIONAL_DAY_GIFT_PACKAGE:
            if(!nextState.has_clicked_national_day_gift_package){
                nextState.has_clicked_national_day_gift_package = true;
            }
            return nextState;
        case PROFILE.CLICK_NATIONAL_DAY_GIFT_PACKAGE_11_11:
            if(!nextState.has_clicked_national_day_gift_package_11_11){
                nextState.has_clicked_national_day_gift_package_11_11 = true;
            }
            return nextState;
        default:
            return state;
    }
};