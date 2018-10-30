/**
 * Created by WangLu on 2017/1/20.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_myself_record_list = (state = default_states.growing_myself_record_list, action = null)=> {
    let myself_list_action_type = action_types.GROWING_MYSELF_RECORD;
    let nextState = Object.assign({}, state);
    let payload = action.payload;
    switch (action.type) {
        case myself_list_action_type.FETCH_RECORD_LIST_SUCCESS:
            nextState.recordList = payload.recordList;
            nextState.headImg = payload.headImg;
            nextState.totalCount = payload.totalCount;
            return nextState;
        case myself_list_action_type.SEND_PRAISE_SUCCESS: //点赞
        case myself_list_action_type.CANCEL_PRAISE_SUCCESS: //取消点赞
        case myself_list_action_type.SEND_FLOWER_SUCCESS: //送花
        case myself_list_action_type.CANCEL_FLOWER_SUCCESS: //取消送花
            nextState.recordList[payload.index] = payload.record;
            return nextState;
        case myself_list_action_type.DELETE_RECORD_SUCCESS: //删除
            nextState.recordList.splice(payload,1); //举报后从列表中删除数据
            return nextState;
        default:
            return nextState;
    }
};
export default growing_myself_record_list;
