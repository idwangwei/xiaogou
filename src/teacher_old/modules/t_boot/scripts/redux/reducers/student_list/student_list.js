/**
 * Created by liangqinli on 2016/11/2.
 */
import {student_list} from './../../default_states/index';
import {STUDENT_LIST_REQUEST,
    STUDENT_LIST_SUCCESS,
    STUDENT_LIST_FAILURE} from './../../action_typs';
/*
 * {
 *    [clazzId] : []
 * }
 * */
export default function(state = student_list,action){
    switch(action.type){
        case STUDENT_LIST_REQUEST:
            return state;
        case STUDENT_LIST_SUCCESS:
            return {
               [action.clazzId]: action.students
            }
        case STUDENT_LIST_FAILURE:
            return state;
        default: return state;
    }
}