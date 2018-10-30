/**
 * Created by WangLu on 2017/3/4.
 */
import * as default_status from './../../default_states/index';
import {OM_CLAZZ_MANAGER} from './../../action_typs';
import _assign from 'lodash.assign';

export default (state = default_status.om_cm_processing, action = null)=>{
    let nextState = _assign({},state);
    let action_types = OM_CLAZZ_MANAGER;
    switch (action.type){
        case action_types.OM_TOGGLE_CLAZZ_APPLY_TUNNEL_START:
            nextState.toggle_apply_tunnel_processing = true;
            return nextState;
        case action_types.OM_TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS:
        case action_types.OM_TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL:
            nextState.toggle_apply_tunnel_processing = false;
            return nextState;

        case action_types.OM_GET_ADD_STU_LIST_START:
            nextState.fetch_added_stu_list_processing = true;
            return nextState;
        case action_types.OM_GET_ADD_STU_LIST_SUCCESS:
        case action_types.OM_GET_ADD_STU_LIST_FAIL:
            nextState.fetch_added_stu_list_processing = false;
            return nextState;

        case action_types.OM_ADD_CLAZZ_START:
            nextState.add_clazz_processing = true;
            return nextState;
        case action_types.OM_ADD_CLAZZ_SUCCESS:
        case action_types.OM_ADD_CLAZZ_FAIL:
            nextState.add_clazz_processing = false;
            return nextState;

        case action_types.OM_EDIT_CLAZZ_START:
            nextState.edit_clazz_info_processing = true;
            return nextState;
        case action_types.OM_EDIT_CLAZZ_SUCCESS:
        case action_types.OM_EDIT_CLAZZ_FAIL:
            nextState.edit_clazz_info_processing = false;
            return nextState;

        case action_types.OM_DELETE_STU_START:
            nextState.del_stu_processing = true;
            return nextState;
        case action_types.OM_DELETE_STU_SUCCESS:
        case action_types.OM_DELETE_STU_FAIL:
            nextState.del_stu_processing = false;
            return nextState;
        default:
            return state;
    }
}