/**
 * Created by qiyuexi on 2018/1/8.
 */
import {Constant} from "../module";
@Constant('computeInterface', {
    IS_COME_FROM_GAME:'IS_COME_FROM_GAME',//从游戏推出后初始化作业端进入游戏列表路由|速算路由
    GET_RC_LEVELS_NAME: '/RapidCalculation/statistics/levelName',   //获取速算关卡信息
    STUDENT_RC_INFO: '/RapidCalculation/statistics/studentGradeInClass', //获取速算个人统计信息
    GET_FIGHTER_RANK:'/RapidCalculation/statistics/classMedal',      //获取玩家在班级中的斗士排行
})
class computeInterface {
}