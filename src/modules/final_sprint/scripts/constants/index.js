/**
 * Created by qiyuexi on 2017/12/7.
 */
import  'ionicJS';
module.exports = angular.module('finalSprint.constants', [])
    .constant('finalSprintInterface', {
        GET_TEACHER_ALL_TASK: '/task/teacher/getAll',//获取教师所有任务：
        GET_KNOWLEDGE_INFO:'/terminal/unit/knowledge',//获取知识点的所有信息
        GET_SCORE_INFO:'/terminal/paper/analysis',//获取分数的相关信息
        GET_PAPER_LIST:'/terminal/get/fourpart',//获取所有试卷信息
        GET_SPRINT_INFO:'/terminal/weekend/permission',//获取周的开启状态
        GET_PAPER_STATUS_LIST:'/terminal/paper/status',//获取所有试卷的状态
        GET_FINAL_SPRINT_GOODS_LIST:'/vip/goodsMenus',//获取前期末冲刺月的商品列表
        CREATE_SPRINT_GOODS_ORDER:'/vip/order',//下订单
        SPRINT_GOODS_ORDER_QUERY: "/vip/orderQuery", //查询订单
    });
