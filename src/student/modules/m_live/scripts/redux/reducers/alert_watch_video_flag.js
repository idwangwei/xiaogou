/**
 * Created by qiyuexi on 2018/5/18.
 */
import * as default_states from '../default_states/index';

import {SET_WATCH_VIDEO_FLAG} from '../action_types';

export default (state = default_states.alert_watch_video_flag, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case SET_WATCH_VIDEO_FLAG:
            return action.payload;
        default:
            return state;
    }
};