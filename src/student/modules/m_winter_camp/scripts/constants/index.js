/**
 * Created by ZL on 2018/1/29.
 */
module.exports = angular.module('m_winter_camp.constants', [])
    .constant('winterCampInterface', {
        CATEGORY: 2, //类型默认家庭 1代表课堂
        IS_COME_FROM_GAME: 'IS_COME_FROM_GAME',//从游戏推出后初始化作业端进入游戏列表路由|速算路由
        GET_GAME_DATA: '/game/rest/knowledge/canPlayGame', //获取游戏列表
        CREATE_WINTER_CAMP_GOODS_ORDER: '/vip/order',//下订单
        WINTER_CAMP_GOODS_ORDER_QUERY: "/vip/orderQuery", //查询订单
        GET_WINTER_CAMP_VIP_GOODS_LIST: '/vip/goodsMenus',//获取商品列表
        WINTER_CAMP_GET_CLASS_DETAIL: '/class/combo/getClassDetail',//获取课时信息
        WINTER_CAMP_GET_CLASS_LIST: '/class/combo/getClassList',//获取所有课程
        OPEN_RESOURCE:'/vip/openResource',//开始VIP
        WINTER_CAMP_GET_AWARD:'/class/combo/getAward',
        GET_KNOWLEDGE_INFO:'/terminal/unit/knowledge',//获取知识点的所有信息
    });
