/**
 * Created by qiyuexi on 2018/1/8.
 */
import {COMPUTE} from '../action_types';
import * as defaultStates from '../default_states';


export default (state = defaultStates.compute_selected_clazz, action = null) =>{
    switch (action.type) {
        case COMPUTE.COMPUTE_CHANGE_CLAZZ:
            return action.payload;
        default :
            return state;
    }
}