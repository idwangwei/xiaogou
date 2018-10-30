/**
 * Created by ZL on 2017/11/28.
 */
import example_with_question from './reducers/example_with_question'
import fetch_exam_with_ques_processing from './reducers/fetch_exam_with_ques_processing'
import tiny_class_ques_submit_processing from './reducers/tiny_class_ques_submit_processing'
import micro_grade_list from './reducers/micro_grade_list'
import micro_select_unit_grade from './reducers/micro_select_unit_grade'
import micro_unit_list from './reducers/micro_unit_list'
import micro_select_unit_item from './reducers/micro_select_unit_item'
import micro_example_list from './reducers/micro_example_list'
import micro_select_example_item from './reducers/micro_select_example_item'
import micro_example_detail from './reducers/micro_example_detail'
import micro_vip_list from './reducers/micro_vip_list'
import select_micro_goods from './reducers/select_micro_goods'
import micro_goods_created_order_info from './reducers/micro_goods_created_order_info'
import fetch_micro_all_ques_records_processing from './reducers/fetch_micro_all_ques_records_processing'
import micro_all_ques_records_pagination_info from './reducers/micro_all_ques_records_pagination_info'
import mirco_with_report from './reducers/mirco_with_report'
import micro_pay_back_url from './reducers/micro_pay_back_url'
import micro_do_question_mark from './reducers/micro_do_question_mark'
let rootReducer={
    example_with_question,
    fetch_exam_with_ques_processing,
    tiny_class_ques_submit_processing,
    micro_grade_list,
    micro_select_unit_grade,
    micro_unit_list,
    micro_select_unit_item,
    micro_example_list,
    micro_select_example_item,
    micro_example_detail,
    micro_vip_list,
    fetch_micro_all_ques_records_processing,
    micro_all_ques_records_pagination_info,
    mirco_with_report,
    select_micro_goods,
    micro_goods_created_order_info,
    micro_pay_back_url,
    micro_do_question_mark
};
export default rootReducer;