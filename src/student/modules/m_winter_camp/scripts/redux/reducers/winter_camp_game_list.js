/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP_GAME} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function winter_camp_game_list(state = defaultStates.winter_camp_game_list, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_SUCCESS:
            return action.payload;
        default :
            return state;
    }
}
export default winter_camp_game_list;