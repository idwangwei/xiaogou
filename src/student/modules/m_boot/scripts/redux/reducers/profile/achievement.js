/**
 * Created by 彭建伦 on 2016/4/18.
 */
import {ACHIEVEMENT} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';

let profile_achievement = (state = defaultStates.profile_achievement, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        /*我的成就*/
        case ACHIEVEMENT.FETCH_ACHIEVEMENT_START:
            nextState.isFetchAchievementProcessing = true;
            return nextState;
        case ACHIEVEMENT.FETCH_ACHIEVEMENT_SUCCESS:
            nextState.isFetchAchievementProcessing = false;
            nextState.achievementList = action.payload;
            return nextState;
        case ACHIEVEMENT.FETCH_ACHIEVEMENT_FAIL:
            nextState.isFetchAchievementProcessing = false;
            nextState.errorInfo = action.payload;
            return nextState;
        default:
            return state
    }
};
export default profile_achievement;
