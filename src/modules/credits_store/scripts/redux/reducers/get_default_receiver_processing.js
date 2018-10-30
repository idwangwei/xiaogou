/**
 * Created by ZL on 2017/11/10.
 */
import * as default_states from '../default_states/index';
import {GET_DEFAULT_RECEIVER_START,
    GET_DEFAULT_RECEIVER_SUCCESS,
    GET_DEFAULT_RECEIVER_FAIL,} from '../action_types';

export default (state = default_states.get_default_receiver_processing, action = null)=> {
    switch (action.type) {
        case GET_DEFAULT_RECEIVER_START:
            return false;
        case GET_DEFAULT_RECEIVER_FAIL:
            return false;
        case GET_DEFAULT_RECEIVER_SUCCESS:
            return true;
        default:
            return state;
    }
};