/**
 * Created by ZL on 2018/1/31.
 */
import {WINTER_CAMP_GAME} from '../action_types/index';
import * as defaultStates from '../default_states/index';
import lodash_assign from 'lodash.assign';


function select_winter_camp_game(state = defaultStates.select_winter_camp_game, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP_GAME.SELECT_WINTER_CAMP_GAME:
            return action.payload;
        default :
            return state;
    }
}
export default select_winter_camp_game;