/**
 * Created by qiyuexi on 2018/4/25.
 */
import {Constant} from "../module";
@Constant('liveInterface', {
    GET_COURSE_LIST: '/video/live/get/public/lessons',//获取所有公开课：
    GET_COURSE_DETAIL:'/video/live/get/public/lesson/detail',//获取公开课详情信息
    VERIFY_MSG:'/vc/video/live/verifyTelVC',//验证短信并报名
    SEND_MSG:'/vc/web/getTelVC',//发送验证码
    GET_PAPER_STATUS_LIST:'/terminal/paper/status',//获取所有试卷的状态
    CREATE_LIVE_GOODS_ORDER:'/vip/order',//下订单
    LIVE_GOODS_ORDER_QUERY: "/vip/orderQuery", //查询订单
    GET_ACCESS_TOKEN:"/video/live/get/accessToken",//获取视频token
    GET_VIDEO_URL:"/video/live/get/playbackUrl",//获取视频回放地址
    GET_COURSE_LESSONS:"/video/live/get/course/lessons",//获取套课
})
class liveInterface {
}