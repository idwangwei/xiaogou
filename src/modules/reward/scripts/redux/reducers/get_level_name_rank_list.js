/**
 * Created by WL on 2017/6/14.
 */
/**
 * Created by Administrator on 2017/5/9.
 */
import * as default_states from '../../../../../modules/reward/scripts/redux/default_states/index';
import {FETCH_LEVEL_NAME_RANK_LIST_START
        ,FETCH_LEVEL_NAME_RANK_LIST_SUCCESS
        ,FETCH_LEVEL_NAME_RANK_LIST_FAIL
        ,CLEAR_LEVEL_NAME_RANK_LIST} from '../action_types';

export default (state = default_states.get_level_name_rank_list, action = null)=> {
    switch (action.type) {
        case FETCH_LEVEL_NAME_RANK_LIST_START:
        case FETCH_LEVEL_NAME_RANK_LIST_FAIL:
            return state;
        case FETCH_LEVEL_NAME_RANK_LIST_SUCCESS:
        case CLEAR_LEVEL_NAME_RANK_LIST:
            return action.payload;
        default:
            return state;
    }
};