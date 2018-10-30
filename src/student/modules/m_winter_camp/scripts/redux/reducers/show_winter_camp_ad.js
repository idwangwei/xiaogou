/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';

export default function (state = defaultStates.show_winter_camp_ad, action = null) {
    switch (action.type) {
        case WINTER_CAMP.CHANGE_AD_SHOW_FLAG:
            return false;
        default :
            return state;
    }
}
