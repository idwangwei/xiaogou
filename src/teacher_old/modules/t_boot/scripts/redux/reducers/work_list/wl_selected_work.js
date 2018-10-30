import * as default_states from './../../default_states/index';
import {
    SELECT_PUBLISH_WORK
    ,SELECT_ARCHIVED_WORK
    ,FETCH_STUDENT_LIST_SUCCESS
} from './../../action_typs';
import _assign from 'lodash.assign';

export  default (state=default_states.wl_selected_work,action=null)=>{
    let newState = _assign({},state);
    switch (action.type) {
        case SELECT_PUBLISH_WORK:
        case SELECT_ARCHIVED_WORK:
            newState = action.payload;
            return newState;
        case "SELECT_AE_WORK":
            newState['publishType'] = action.payload.publishType;
            newState['paperId'] = action.payload.paperId;
            newState['paperInstanceId'] = action.payload.paperId;
            newState['instanceId'] = action.payload.paperId;
            newState['paperName'] = action.payload.paperName;
            newState['isAE'] = action.payload.isAE;
            newState['paperType'] = action.payload.paperType;
            return newState;
        case FETCH_STUDENT_LIST_SUCCESS:
            newState['stu'] = action.payload.stu;
            newState['isShowStatistics'] = action.payload.isShowStatistics;
            return newState;
        default:
            return state;
    }

};
