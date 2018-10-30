/**
 * Created by liangqinli on 2016/10/29.
 */
import {rapid_calc_list} from "./../../default_states/index";
import {
    RAPID_CALC_COUNT_REQUEST,
    RAPID_CALC_COUNT_SUCCESS,
    RAPID_CALC_COUNT_FAILURE,
    CLEAR_RC_LIST
} from './../../action_typs';

  /*
  * {
  * totalLevel: Num,
  * studentPassInfo: []
  * }
  * */
export default function(state = rapid_calc_list,action){
    switch(action.type){
        case RAPID_CALC_COUNT_REQUEST:
            return state;
        case RAPID_CALC_COUNT_SUCCESS:
            return action.studentPassInfo;
        case RAPID_CALC_COUNT_FAILURE:
            return [];
        case CLEAR_RC_LIST:
            return [];
        default: return state;
    }
}