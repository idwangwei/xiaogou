/**
 * Created by ZL on 2017/11/6.
 */
import teacher_task_list from './reducers/teacher_task_list';
import select_teacher_task from './reducers/select_teacher_task';
import default_receiver from './reducers/default_receiver';
import get_default_receiver_processing from './reducers/get_default_receiver_processing';
// import teacher_credits_detail from './reducers/teacher_credits_detail';
import credits_goods_list from './reducers/credits_goods_list';
import credits_goods_list_processing from './reducers/credits_goods_list_processing';
import select_credits_goods from './reducers/select_credits_goods';
import teacher_ratory_info from './reducers/teacher_ratory_info';

let rootReducer = {
    teacher_task_list,
    select_teacher_task,
    default_receiver,
    get_default_receiver_processing,
    // teacher_credits_detail,
    credits_goods_list_processing,
    credits_goods_list,
    select_credits_goods,
    teacher_ratory_info
};
export default rootReducer;