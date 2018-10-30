/**
 * Created by liangqinli on 2016/10/31.
 */
import {rc_selected_clazz} from './../../default_states/index';
import {RC_CHANGE_CLAZZ} from './../../action_typs';
/*
 * {
 *     name: '',
 *     id: '',
 *     grade: ''
 * }
 * */
export default function(state = rc_selected_clazz,action){
    switch(action.type){
        case RC_CHANGE_CLAZZ:
            return Object.assign({}, state, {
                name: action.name,
                id: action.id,
                grade: action.grade,
                type:action.bookType
            });
        default: return state;
    }
}