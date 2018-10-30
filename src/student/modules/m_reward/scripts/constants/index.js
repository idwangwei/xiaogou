/**
 * Created by Administrator on 2017/5/5.
 */
module.exports = angular.module('m_reward.constants', [])
    .constant('rewardInterface', {
        GET_USER_LIST_BY_PHONE: '/um/userBaseInfo',     //获取玩家在班级中的斗士排行
        GET_SIGN_IN_INFO: "/signIn/get",//获取当前签到情况接口
        SIGN_IN_EXECUTE: '/signIn/execute',//签到接口
        GET_DAY_TASK: "/task/get",//获取任务接口
        GET_TASK_AWARD: "/task/award",//完成任务领取奖励接口
        GET_GOODS_LIST: '/credits/expense/getGoods',//获取可兑换商品列表
        BUY_GOODS: '/credits/expense/order',//积分兑换商品
        LEVEL_NAME_LIST: '/credits/user/listTitle',//称号列表
        CHANGE_USER_HEAD: '/credits/user/update',//修改称号和用户头像
        GET_LEVEL_NAME_RANK_LIST: '/credits/user/classTitles',//获取班级称号列表
    });
