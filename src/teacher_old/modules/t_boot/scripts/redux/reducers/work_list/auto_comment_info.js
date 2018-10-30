/**
 * Created by ZL on 2017/9/12.
 */
import * as default_states from './../../default_states/index';
import {
    SAVE_AUTO_COMMENT
} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state=default_states.auto_comment_info,action=null)=>{
    switch (action.type) {
        case SAVE_AUTO_COMMENT:
            let newState = _assign({},state);
            newState =action.payload;
            return newState;
        default:
            return state;
    }

};
