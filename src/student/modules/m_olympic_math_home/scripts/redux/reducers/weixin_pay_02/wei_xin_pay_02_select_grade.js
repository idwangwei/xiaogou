/**
 * Created by ZL on 2017/3/13.
 */
import {WEIXIN_PAY} from  "./../../action_types/index";
import * as defaultStates from "./../../default_states/index";
import lodash_assign from 'lodash.assign';

let wei_xin_pay_02_select_grade = (state = defaultStates.wei_xin_pay_02_select_grade, action = null)=> {
    switch (action.type) {
        case WEIXIN_PAY.SAVE_WEI_XIN_PAY_02_SELECT_GRADE:
            return lodash_assign({}, action.payload);
        default:
            return state

    }
};
export default wei_xin_pay_02_select_grade;