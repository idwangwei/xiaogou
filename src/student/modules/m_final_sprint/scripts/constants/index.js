/**
 * Created by qiyuexi on 2017/12/7.
 */
import {Constant} from "../module";
@Constant('finalSprintInterface', {
        GET_TEACHER_ALL_TASK: '/task/teacher/getAll',//获取教师所有任务：
        GET_KNOWLEDGE_INFO:'/terminal/unit/knowledge',//获取知识点的所有信息
        GET_SCORE_INFO:'/terminal/paper/analysis',//获取分数的相关信息
        GET_PAPER_LIST:'/terminal/get/fourpart',//获取所有试卷信息
        GET_SPRINT_INFO:'/terminal/weekend/permission',//获取周的开启状态
        GET_PAPER_STATUS_LIST:'/terminal/paper/status',//获取所有试卷的状态
})
class finalSprintInterface {
}