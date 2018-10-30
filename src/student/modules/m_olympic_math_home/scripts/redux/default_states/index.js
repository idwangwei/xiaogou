/**
 * Created by ZL on 2018/1/15.
 */
export let olympic_math_selected_clazz={};//奥数当前选中的年级
export let olympic_math_selected_grade={};//奥数当前选中的班级
export let work_list_route={};//作业列表的入口来源

//////////奥数支付
export let mo_goods_menus_list = {};//奥数商品列表
export let fetch_wei_xin_pay_02_goods_processing = false; //获取商品选择列表状态
export let fetch_wei_xin_pay_02_create_order_processing = false; //创建订单状态
export let fetch_wei_xin_pay_02_order_processing = false; //查询订单的状态
export let wei_xin_pay_02_select_good = {};//选择的商品
// export let wei_xin_pay_02_created_order_info = {};//订单信息
export let wei_xin_pay_02_created_order_info = { //订单信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};

export let wei_xin_pay_02_select_grade={};//选择的年级