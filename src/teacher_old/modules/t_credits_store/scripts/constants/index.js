/**
 * Created by ZL on 2017/11/6.
 */
import {Constant} from "../module";
@Constant('creditsStoreInterface', {
    GET_TEACHER_ALL_TASK: '/task/teacher/getAll',//获取教师所有任务：
    CREATE_CLAZZ_INVITE_STUDENT_TASK_DETAIL: '/task/teacher/inviteStudent/detail',//创建班级并邀请20名学生加入的任务详情
    INVITE_OTHER_TEACHER_TASK_DETAIL: '/task/teacher/recommendTeacher/detail',//邀请老师的任务详情
    PUBLISH_WORK_TASK_DETAIL: '/task/teacher/paper/detail',//布置作业任务详情
    PUBLISH_GAME_TASK_DETAIL: '/task/teacher/game/detail',//布置游戏任务详情
    GET_DEFAULT_RECEIVER_INFO: '/credits/teacher/getDefaultReceiverInfo',//获取默认收件人
    GET_ALL_AWARD_LIST: '/task/teacher/awardList',//获取任务奖励列表：
    TASK_GAIN_AWARD: '/task/teacher/gainAward',//领取任务奖励：
    GET_TEACHER_SCORE_LIST: '/credits/teacher/history',//获取教师积分列表
    GET_TEACHER_SCORE_DETAIL: '/credits/teacher/getCredits',//获取教师积分详情
    GET_GOODS_LIST: '/credits/teacher/goods',//获取商品列表
    CREDITS_ORDER: '/credits/teacher/creditsOrder',//下订单
    GET_ORDER_DETAIL: '/credits/teacher/getOrderDetail',//查询订单
    FINISH_ORDER: '/credits/teacher/finishOrder',//确认订单完成
    TEACHER_TEACH_DETAIL: '/task/teacher/teach/detail',//教学实效详情
    GET_RATORY_LIST: '/task/teacher/lottoInfo',//获取奖品信息列表
    GET_RATORY_INFO: '/task/teacher/lotto',//获取中奖奖品
})
class creditsStoreInterface {
}