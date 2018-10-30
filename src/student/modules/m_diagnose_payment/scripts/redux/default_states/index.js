/**
 * Created by ZL on 2018/1/15.
 */

export let wxpay_created_order_info = { //微信支付信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};
export let wxpay_create_order_info_processing = false;
export let wxpay_query_order_processing = false;

export let wxpay_detail_list={};//微信支付详情
export let wxpay_detail_fetch_processing = false;

export let group_buying_goods_list={};//团购商品列表
export let group_buying_goods_list_fetch_processing = false;//获取团购商品列表状态

export let query_group_buying_order_processing = false;//获取团购订单状态
export let group_buying_create_order_info_processing = false; //团购下单状态
export let group_buying_selected_good= {}; //团购的商品详情
export let group_buying_created_order_info = { //团购微信支付信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};