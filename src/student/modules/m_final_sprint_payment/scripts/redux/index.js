/**
 * Created by qiyuexi on 2017/12/7.
 */

import final_sprint_goods_list from './reducers/final_sprint_goods_list';
import final_sprint_goods_list_processing from './reducers/final_sprint_goods_list_processing';
import select_sprint_goods from './reducers/select_sprint_goods';
import sprint_goods_created_order_info from './reducers/sprint_goods_created_order_info';

let rootReducer = {
    final_sprint_goods_list,
    final_sprint_goods_list_processing,
    select_sprint_goods,
    sprint_goods_created_order_info,
};
export default rootReducer;