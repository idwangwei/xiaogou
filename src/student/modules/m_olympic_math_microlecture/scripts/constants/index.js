/**
 * Created by ZL on 2017/11/28.
 */

module.exports = angular.module('m_olympic_math_microlecture.constants',[])
    .constant('olympicMathMicrolectureInterface', {
        TINY_CLASS_GET_QUES: '/qus/api/tinyClass/getQuestion', //获取试题
        TINY_CLASS_POST_QUES_ANS:'/qus/api/tinyClass/postQuestionAnswer',//提交答案：
        TINY_CLASS_CORRECT_QUES:'/qus/api/tinyClass/correctQuestion',//单题改错
        TINY_CLASS_GET_QUES_HISTORY:'/qus/api/tinyClass/getQuestionHistory',//单题的做题记录
        TINY_CLASS_GET_QUES_GROUP_HISTORY:'/qus/api/tinyClass/getQuestionGroupHistory',//整个例的做题记录
        GET_GRADE_LIST:"/olympics/grade/show",//获取班级的列表
        GET_EXAMPLE_LIST:"/olympics/groups/questions",//根据单元的id获取例子列表
        GET_UNIT_LIST:"/olympics/get/units",//根据年级获取单元的列表
        GET_EXAMPLE_DETAIL:"/qus/api/tinyClass/getQuestionGroupDetail",//根据例子的id获取例子的详情
        ACCEPT_AWARD:"/qus/api/tinyClass/award",//根据领奖id领奖
        GET_VIP_LIST:"/vip/goodsMenus",//获取支付商品列表
        CREATE_MICRO_GOODS_ORDER:'/vip/order',//下订单
        MICRO_GOODS_ORDER_QUERY: "/vip/orderQuery", //查询订单
        VIP_OPEN_RESOURCE:"/vip/openResource",//利用支付商品去解锁资源
        GET_VIDEO_CONFIG:"/olympics/get/vedio", //获取视频配置
        SAVE_VIDEO_INTERACTION_INFO:"/qus/api/tinyClass/saveVideoProgress", //保存视频交互结果
    })
    .constant('olympicMathMicrolectureFinalData',{
        ML_TYPE:{
                SELECT:1, //选择题
                FILLBLANK:2 //填空题
        } //智导微课交互问题类型
    });