/**
 * Created by ZL on 2017/6/6.
 */
import {WORK_REPORT} from '../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

export default (state = default_states.diagnose_ad_dialog_flag, action = null)=>{
    switch (action.type) {
        case WORK_REPORT.CHANGE_DIAGNOSE_DIALOG_FLAG:
            return true;
        default:
            return state;
    }
}