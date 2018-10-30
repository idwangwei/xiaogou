/**
 * Created by liangqinli on 2016/10/12.
 */
import { CHANGE_CLAZZ } from '../../action_typs';
import {gl_selected_clazz} from './../../default_states/index';


export default function(state = gl_selected_clazz, action){
    switch(action.type){
        case CHANGE_CLAZZ:
            return Object.assign({}, state, {
                name: action.name,
                id: action.id,
                type:action.bookType
            });
        default: return state;
    }
}