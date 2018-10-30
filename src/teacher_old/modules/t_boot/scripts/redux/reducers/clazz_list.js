import * as default_states from './../default_states/index';
import {
     FETCH_CLAZZ_LIST_SUCCESS
    ,FETCH_CLAZZ_LIST_FAIL
    ,TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS
    ,CHANGE_CLAZZ_LIST_INFO
} from './../action_typs';
import _assign from 'lodash.assign';


export  default (state=default_states.clazz_list,action=null)=>{
    let nextState = state.map((value) =>{return _assign({},value)});
    switch (action.type) {
        case FETCH_CLAZZ_LIST_SUCCESS:
            return action.payload.clazzList;
        case TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS:
            return action.payload;
        case CHANGE_CLAZZ_LIST_INFO:
            return action.payload;
        case FETCH_CLAZZ_LIST_FAIL:
        default:
            return state;
    }

};
