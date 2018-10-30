/**
 * Created by ZL on 2018/1/15.
 */
import olympic_math_selected_clazz from './reducers/olympic_math/olympic_math_selected_clazz';
import olympic_math_selected_grade from './reducers/olympic_math/olympic_math_selected_grade';
import work_list_route from './reducers/olympic_math/work_list_route';

import fetch_wei_xin_pay_02_create_order_processing from './reducers/weixin_pay_02/fetch_wei_xin_pay_02_create_order_processing';
import fetch_wei_xin_pay_02_goods_processing from './reducers/weixin_pay_02/fetch_wei_xin_pay_02_goods_processing';
import fetch_wei_xin_pay_02_order_processing from './reducers/weixin_pay_02/fetch_wei_xin_pay_02_order_processing';
import mo_goods_menus_list from './reducers/weixin_pay_02/mo_goods_menus_list';
import wei_xin_pay_02_created_order_info from './reducers/weixin_pay_02/wei_xin_pay_02_created_order_info';
import wei_xin_pay_02_select_good from './reducers/weixin_pay_02/wei_xin_pay_02_select_good';
import wei_xin_pay_02_select_grade from './reducers/weixin_pay_02/wei_xin_pay_02_select_grade';


let rootReducer = {
    olympic_math_selected_clazz,
    olympic_math_selected_grade,
    work_list_route,
    fetch_wei_xin_pay_02_create_order_processing,
    fetch_wei_xin_pay_02_goods_processing,
    fetch_wei_xin_pay_02_order_processing,
    mo_goods_menus_list,
    wei_xin_pay_02_created_order_info,
    wei_xin_pay_02_select_good,
    wei_xin_pay_02_select_grade
};
export default rootReducer;