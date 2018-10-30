/**
 * Created by ZL on 2018/1/30.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';

function winter_camp_selected_textbook(state = defaultStates.winter_camp_selected_textbook, action = null) {
    let nextState=Object.assign({},state);
    switch (action.type) {
        case WINTER_CAMP.WINTER_CAMP_SELECTED_TEXTBOOK:
            return lodash_assign({},action.payload);
        default :
            return state;
    }
}
export default winter_camp_selected_textbook;