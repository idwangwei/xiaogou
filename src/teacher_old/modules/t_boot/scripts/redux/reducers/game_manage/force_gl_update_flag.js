/**
 * Created by liangqinli on 2016/10/24.
 */
import { FORCE_GL_UPDATE , CANCEL_FORCE_GL_UPDATE} from '../../action_typs';
import {force_gl_update_flag} from './../../default_states/index';



export default function(state = force_gl_update_flag, action){
    switch(action.type){
        case FORCE_GL_UPDATE :
            return true;
        case CANCEL_FORCE_GL_UPDATE:
            return false;
        default: return state;
    }
}