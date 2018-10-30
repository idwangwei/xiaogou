/**
 * Created by WangLu on 2017/3/1.
 */
import * as action_types from './../../actiontypes/actiontypes';
import * as default_states from './../../default_states/default_states';

let growing_one_clazz_record_info = (state = default_states.growing_one_clazz_record_info, action = null)=> {
    let clazz_action_ype = action_types.GROWING_ONE_CLAZZ;
    let nextState = Object.assign({}, state);
    switch (action.type){
        case clazz_action_ype.FETCH_ONE_CLAZZ_INFO_START:
        case clazz_action_ype.FETCH_ONE_CLAZZ_INFO_FAIL:
        case clazz_action_ype.IMPEACH_RECORD_START:
        case clazz_action_ype.IMPEACH_RECORD_FAIL:
            return nextState;
        case clazz_action_ype.FETCH_ONE_CLAZZ_INFO_SUCCESS:
            nextState.hasMore = action.payload.hasMore;
            if(nextState.seq == 1){
                nextState.recordList = action.payload.recordList;
            }else{
                nextState.recordList = nextState.recordList.concat(action.payload.recordList);
            }
            nextState.seq++;
            return nextState;
        case clazz_action_ype.CHANGE_DISPLAY_SELECTED_CLAZZ:
            nextState.seq = 1;
            nextState.hasMore = true;
            if(action.payload){
                nextState.selectedClazz = action.payload;
            }
            return nextState;
        case clazz_action_ype.IMPEACH_RECORD_SUCCESS: //举报
        case clazz_action_ype.DELETE_RECORD_SUCCESS: //删除
            nextState.recordList.splice(action.payload,1);
            return nextState;
        case clazz_action_ype.SEND_PRAISE_SUCCESS: //点赞
        case clazz_action_ype.CANCEL_PRAISE_SUCCESS: //取消点赞
        case clazz_action_ype.SEND_FLOWER_SUCCESS: //送花
        case clazz_action_ype.CANCEL_FLOWER_SUCCESS: //取消送花
            nextState.recordList[action.payload.index] = action.payload.record;
            return nextState;
        default:
            return nextState;
    }
};
export default growing_one_clazz_record_info;
