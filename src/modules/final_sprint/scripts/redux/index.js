/**
 * Created by qiyuexi on 2017/12/7.
 */

import first_come_in from './reducers/first_come_in';
import select_sprint_week from './reducers/select_sprint_week';
import final_sprint_goods_list from './reducers/final_sprint_goods_list';
import final_sprint_goods_list_processing from './reducers/final_sprint_goods_list_processing';
import select_sprint_goods from './reducers/select_sprint_goods';
import sprint_goods_created_order_info from './reducers/sprint_goods_created_order_info';
import final_sprint_paper_list from './reducers/final_sprint_paper_list';
import final_sprint_paper_status_list from './reducers/final_sprint_paper_status_list';
import final_sprint_paper_info from './reducers/final_sprint_paper_info';

let rootReducer = {
    first_come_in,
    select_sprint_week,
    final_sprint_goods_list,
    final_sprint_goods_list_processing,
    select_sprint_goods,
    sprint_goods_created_order_info,
    final_sprint_paper_list,
    final_sprint_paper_status_list,
    final_sprint_paper_info,
};
export default rootReducer;