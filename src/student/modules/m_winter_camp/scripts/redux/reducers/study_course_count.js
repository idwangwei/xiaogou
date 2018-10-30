/**
 * Created by ZL on 2018/2/8.
 */
import {WINTER_CAMP} from '../action_types/index';
import * as defaultStates from '../default_states/index';

export default function (state = defaultStates.study_course_count, action = null) {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case WINTER_CAMP.CHANGE_STUDY_COURSE_COUNT:
            if (!nextState[action.payload.courseMarkId])
                nextState[action.payload.courseMarkId] = {
                    dayTime: '2018/1/1',
                };
            let currentDate = new Date();
            let dayTime = currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate();
            if (nextState[action.payload.courseMarkId].dayTime == dayTime) return nextState;
            nextState[action.payload.courseMarkId].dayTime = dayTime;
            nextState[action.payload.courseMarkId].comboClassId = action.payload.comboClassId;
            nextState[action.payload.courseMarkId].todayFlag = action.payload.todayFlag;
            return nextState;
        case WINTER_CAMP.CHANGE_STUDY_COURSE_COUNT_STATUS:
            nextState[action.payload.courseMarkId].todayFlag = action.payload.todayFlag;
            return nextState;
        default :
            return state;
    }
}