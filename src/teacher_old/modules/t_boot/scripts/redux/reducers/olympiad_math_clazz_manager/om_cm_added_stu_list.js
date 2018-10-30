/**
 * Created by WangLu on 2017/3/4.
 */
import * as default_status from './../../default_states/index';
import {OM_CLAZZ_MANAGER} from './../../action_typs';
import _assign from 'lodash.assign';

export default (state = default_status.om_cm_added_stu_list, action = null)=>{
    let nextState = _assign({},state);
    switch (action.type){
        case OM_CLAZZ_MANAGER.OM_GET_ADD_STU_LIST_SUCCESS:
        case OM_CLAZZ_MANAGER.OM_CHANGE_STU_LIST_LEVEL_SUCCESS:
            nextState = action.payload;
            return nextState;
        case OM_CLAZZ_MANAGER.OM_GET_ADD_STU_LIST_START:
        case OM_CLAZZ_MANAGER.OM_GET_ADD_STU_LIST_FAIL:
        case OM_CLAZZ_MANAGER.OM_CHANGE_STU_LIST_LEVEL_START:
        case OM_CLAZZ_MANAGER.OM_CHANGE_STU_LIST_LEVEL_FAIL:
            return state;
        default:
            return state;
    }
}