/**
 * Created by liangqinli on 2016/9/30.
 */
import {FETCH_STUDY_STATIS
    ,FETCH_STUDY_STATIS_SUCCESS
    ,FETCH_STUDY_STATIS_FAILURE } from '../../action_typs';
import {work_statis_list} from './../../default_states/index';



export default function(state = work_statis_list, action){
    switch(action.type){
        case FETCH_STUDY_STATIS:
            return state;
        case FETCH_STUDY_STATIS_SUCCESS:
            return Object.assign({}, state, action.data);
        case FETCH_STUDY_STATIS_FAILURE:
            return state;
        default: return state;
    }
}