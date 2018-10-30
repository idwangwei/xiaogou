/**
 * Created by Administrator on 2017/5/4.
 */
import * as default_states from '../default_states/index';
import {
    FETCH_LEVEL_INFO_SUCCESS,
    OPEN_GAME_LEVEL_BOX_SUCCESS
} from '../action_types/index';
import _find from 'lodash.find';

export default (state = default_states.game_map_level_info, action = null)=> {
    let nextState = Object.assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        case FETCH_LEVEL_INFO_SUCCESS:
            if(!nextState[payload.mapId]){
                nextState[payload.mapId] = {};
            }

            if(payload.levelsWithoutFirst){

                nextState[payload.mapId].levelsWithoutFirst = payload.levelsWithoutFirst;
            }
            if(payload.firstLevel){
                nextState[payload.mapId].firstLevel = payload.firstLevel;
            }
            if(payload.currentStuLevel){
                nextState[payload.mapId].currentStuLevel = payload.currentStuLevel;
            }
            if(payload.passBox){
                nextState[payload.mapId].passBox = payload.passBox;
            }
            return nextState;

        case OPEN_GAME_LEVEL_BOX_SUCCESS:
            let box;
            if(!payload.isPassBox){
               box = _find(nextState[payload.mapId].levelsWithoutFirst,{boxId:payload.boxId});
            }else {
                box = nextState[payload.mapId].passBox
            }
            box.boxCanOpen = false;
            box.boxOpen = true;
            return nextState;

        default:
            return state;
    }
};