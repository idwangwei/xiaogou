/**
 * Created by Administrator on 2017/5/9.
 */
import * as default_states from './../../default_states/default_states';
import {REWARD_INFO} from '../../actiontypes/actiontypes';

export default (state = default_states.level_name_list, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case REWARD_INFO.FETCH_LEVEL_NAME_LIST:
            nextState.levelNameList = action.payload.nameList;
            nextState.levelAnalyzeData = action.payload.levelData;
            return nextState;
        default:
            return state;
    }
};