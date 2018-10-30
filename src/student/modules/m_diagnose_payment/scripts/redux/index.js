/**
 * Created by ZL on 2018/1/15.
 */
import wxpay_create_order_info_processing from './reducers/wxpay_create_order_info_processing';
import wxpay_created_order_info from './reducers/wxpay_created_order_info';
import wxpay_detail_fetch_processing from './reducers/wxpay_detail_fetch_processing';
import wxpay_detail_list from './reducers/wxpay_detail_list';
import wxpay_query_order_processing from './reducers/wxpay_query_order_processing';
import query_group_buying_order_processing from './reducers/query_group_buying_order_processing';
let rootReducer={
    wxpay_create_order_info_processing,
    wxpay_created_order_info,
    wxpay_detail_fetch_processing,
    wxpay_detail_list,
    wxpay_query_order_processing,
    query_group_buying_order_processing
};
export default rootReducer;