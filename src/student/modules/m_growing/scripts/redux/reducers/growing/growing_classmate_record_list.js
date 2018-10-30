/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_classmate_record_list = (state = default_states.growing_classmate_record_list, action = null)=> {
    let classmate_list_action_type = action_types.GROWING_CLASSMATE_RECORD;
    let nextState = Object.assign({}, state);
    let payload = action.payload;

    switch (action.type) {
        case classmate_list_action_type.FETCH_RECORD_LIST_SUCCESS: //获取同学列表信息
            nextState.recordList = payload.recordList;
            nextState.headImg = payload.headImg;
            return nextState;
        case classmate_list_action_type.SEND_PRAISE_SUCCESS: //点赞
        case classmate_list_action_type.CANCEL_PRAISE_SUCCESS: //取消点赞
        case classmate_list_action_type.SEND_FLOWER_SUCCESS: //送花
        case classmate_list_action_type.CANCEL_FLOWER_SUCCESS: //取消送花
            nextState.recordList[payload.index] = payload.record;
            return nextState;
        case classmate_list_action_type.IMPEACH_RECORD_SUCCESS: //举报
            nextState.recordList.splice(payload,1); //举报后从列表中删除数据
            return nextState;
        case classmate_list_action_type.CHANGE_SELECTED_CLASSMATE: //修改选择的学生
            if(payload.userId!=nextState.selectedClassmate.userId){
                nextState.recordList = [];
            }
            nextState.selectedClassmate.userId = payload.userId;
            nextState.selectedClassmate.userName = payload.userName;
            nextState.selectedClassmate.userGender = payload.userGender;
            return nextState;
        default:
            return state;
    }
};
export default growing_classmate_record_list;
