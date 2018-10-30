/**
 * Created by Administrator on 2017/5/4.
 */
import sign_in_status from './reducers/sign_in_status';
import reward_info from './reducers/reward_info';
import sign_in_info from './reducers/sign_in_info';
import reward_day_task from './reducers/reward_day_task';

import fetch_day_task_info_processing from './reducers/fetch_day_task_info_processing';
import fetch_reward_info_processing from './reducers/fetch_reward_info_processing';
import fetch_sign_in_info_processing from './reducers/fetch_sign_in_info_processing';
import get_day_task_award_processing from './reducers/get_day_task_award_processing';
import sign_in_execute_processing from './reducers/sign_in_execute_processing';
import level_name_list_group  from './reducers/level_name_list_group';

import get_level_name_rank_list from './reducers/get_level_name_rank_list';
import get_level_name_rank_list_processing from './reducers/get_level_name_rank_list_processing';

let rootReducer = {
    sign_in_status,
    reward_info,
    sign_in_info,
    reward_day_task,
    fetch_day_task_info_processing,
    fetch_reward_info_processing,
    fetch_sign_in_info_processing,
    get_day_task_award_processing,
    sign_in_execute_processing,
    // fetch_level_name_list_processing,
    level_name_list_group,
    get_level_name_rank_list,
    get_level_name_rank_list_processing
};
export default rootReducer;