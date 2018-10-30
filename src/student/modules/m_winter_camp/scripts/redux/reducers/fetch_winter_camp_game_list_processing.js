/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP_GAME} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function fetch_winter_camp_game_list_processing(state = defaultStates.fetch_winter_camp_game_list_processing, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_START:
            return false;
        case WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_FAIL:
            return false;
        case WINTER_CAMP_GAME.FETCH_WINTER_CAMP_GAME_LIST_SUCCESS:
            return true;
        default :
            return state;
    }
}
export default fetch_winter_camp_game_list_processing;