import {GAME_STATS_SUCCESS} from '../../action_typs';
import {game_statistics} from './../../default_states/index';

export default function(state = game_statistics, action){
    switch(action.type){
        case GAME_STATS_SUCCESS:
            return Object.assign({}, state, action.data);
       /* case SORT_GAME_STATS:
            return Object.assign({}, state, {
                tabData: setOrder(action)
            })*/
        default: return state;
    }
}