/**
 * Created by ww on 2017/3/18.
 */
import  constants from './index';
constants.constant('competitionInterface', {
    GET_COMPETITION_PAPER_INFO: '/qbu/api/race/student/getCompetitionPaper', //获取竞赛试卷基本信息
    GET_COMPETITION_PAPER_INFO_TEACHER: '/qbu/api/race/teacher/getCompetitionPaper', //教师端获取竞赛试卷基本信息
    GET_COMPETITION_REPORT_INFO: '/ms/api/race/getCompetitionReport',//获取竞赛报告信息
});
constants.constant('competitionFinalData', {
    WORK_LIST_URL: 'home.work_list', //三端获取竞赛试卷基本信息的页面路由
    SYSTEM_TEACHER: 'teacher', //教师端
    SYSTEM_STUDENT: 'student', //学生端
    SYSTEM_PARENT: 'parent', //家长端
    COMPETITION_PAPER_COUNT_DOWN_TIME:'competition_paper_count_down_time' //保存在localStorage中竞赛试卷做题试卷倒计时
});

