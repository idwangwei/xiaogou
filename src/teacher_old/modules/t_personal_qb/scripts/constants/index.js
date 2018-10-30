/**
 * Created by ZL on 2018/3/23.
 */
import {Constant} from "../module";
@Constant('teacherPersonalQbInterface', {
    createQuestionForTeacher: '/rqb/question/createQuestionForTeacher',//1.教师自己出题
    getTeacherQbQuestionCount: '/rqb/question/getTeacherQbQuestionCount',//2.教师获取自己的出题个数
    getTeacherQbQuestionList: '/rqb/question/getTeacherQbQuestionList',//3.教师获取自己的出题列表
    makePaperFromTeacherQb: '/pqb/api/paper/makePaperFromTeacherQb',//组卷
    getTextbooks:'/rqb/tag/getTextbooks_v2',//6.教师获取教材目录（1-12册的，以及根据code子节点）
    paperReport:'/qbu/api/simpleStatics/paperReport',//7.教师或者家长通过分享链接来获取作业报告
    deleteQuesFromTeacherQb:'/rqb/question/removeTeacherDbQuestion',//从老师的个人题库中删除题目
})
class teacherPersonalQbInterface {
}