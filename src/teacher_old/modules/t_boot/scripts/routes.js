/**
 * Defines the main routes in the application.
 */
import app from "./app";
'use strict';
app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    // $urlRouterProvider.otherwise('/home');

    $stateProvider
       /* .state('register_success', { //注册成功
            url: '/register_success/:loginName/:flag',
            template: require('./../partials/system_auth/register_success.html'),
            controller: 'registerSuccess'
        })*/
      /*  .state('forget_user_name', {//注册成功
            url: '/forget_user_name',
            template: require('./../partials/system_auth/forget_user_name.html'),
            controller: 'forgetUserNameCtrl'
        })*/
       /* .state('basic_info_first', { //第一次登陆成功
            url: '/basic_info_first',
            template: require('./../partials/personal/basic_info_first.html'),
            controller: 'baseInfoFirstCtrl'
        })*/

      /*  .state('reset_pass', { //重置密码--第一步，设置要找回的账号
            url: '/reset_pass',
            template: require('./../../t_user_auth/scripts/pages/reset_pass/reset_pass.html'),
            controller: 'resetPassCtrl'
        })
        .state('reset_pass_apply', { //重置密码--第二步 验证信息和修改密码
            url: '/reset_pass_apply/:loginName/:phone',
            template: require('./../../t_user_auth/scripts/pages/reset_pass_apply/reset_pass_apply.html'),
            controller: 'resetPassApplyCtrl'
        })
        .state('reset_pass_status', { //重置密码--第一步 验证要找回的账号
            url: '/reset_pass_status/:loginName',
            template: require('./../../t_user_auth/scripts/pages/reset_pass_status/reset_pass_status.html'),
            controller: 'resetPassStatusCtrl'
        })*/

        /*.state('work_generate_paper', { //作业试卷库
            url: "/work_generate_paper",
            template: require('./../partials/work_statistics/work_generate_paper.html'),
            controller: 'workGeneratePaperCtrl as ctrl'
        })*/

        //课堂
        // .state('clazz', {
        //     url: '/clazz',
        //     template: require('./../partials/clazz/clazz_index.html'),
        //     controller: "clazzCtrl"
        // })

        //---------------添加班级选择页  by  彭建伦--------------------------------
        // .state('enter_clazz', {
        //     url: '/enter_clazz',
        //     template: require('./../partials/clazz/enter_clazz.html')
        // })


        /*--------------------候选课堂----------------------*/
        // .state('clazz_backup_game', {//候选课堂游戏
        //     url: 'clazz_backup_game',
        //     template: require('./../partials/clazz/clazz_backup_game.html'),
        //     controller: 'clazzBackupGameCtrl'
        // })
        // .state('clazz_backup_game_detail', { //候选游戏详情
        //     url: 'clazz_backup_game_detail/:id',
        //     template: require('./../partials/clazz/clazz_backup_game_detail.html'),
        //     controller: 'clazzBackupGameDetailCtrl'
        // })
        // .state('clazz_backup_work', { //候选课堂作业
        //     url: 'clazz_backup_work',
        //     template: require('./../partials/clazz/clazz_backup_work.html'),
        //     controller: 'clazzBackupWorkCtrl'
        // })
        // .state('clazz_backup_work_detail', { //候选课堂作业详情
        //     url: 'clazz_backup_work_detail/:from',
        //     template: require('./../partials/clazz/clazz_backup_work_detail.html'),
        //     controller: 'clazzBackupWorkDetailCtrl'
        // })


        /*--------------家庭和课堂共用------------------*/

        // .state('game_pub', { //发布游戏
        //     url: 'game_pub',
        //     cache: false,
        //     template: require('./../../t_game/scripts/pages/game_pub/game_pub.html'),
        //     controller: 'gamePubCtrl'
        // })
       /*
       TODO 好像没有用
       .state('set_work_info', { //设置作业
            url: 'set_work_info/',
            template: require('./../partials/common/set_work_info.html'),
            controller: 'setWorkInfoCtrl'
        })
        .state('work_select_tags', { //选择标签
            url: 'work_select_tags/:fromUrl',
            template: require('./../partials/common/work_select_tags.html'),
            controller: 'workSelectTagsCtrl'
        })
        .state('new_work', {        //创建候选作业
            url: 'new_work',
            template: require('./../partials/common/new_work.html'),
            controller: 'newWorkCtrl'
        })*/
        // .state('select_game', {        //一个游戏详情
        //     url: 'select_game',
        //     template: require('./../partials/common/select_game.html'),
        //     controller: 'selectGameCtrl'
        // })



        /*----------------作业统计 Start--------------------*/
       /* .state('work_praise_detail', {                  //作业表扬
            url: '/work_praise_detail',
            template: require('./../../t_home_teaching_work/scripts/pages/work_praise_detail/work_praise_detail.html'),
            controller: 'workPraiseDetailCtrl'
        })*/


       /* .state('score_distribution', {                  //高级统计
            url: '/score_distribution/:paperTitle/:paperScore/:classFlag',
            template: require('./../../t_home_teaching_work/scripts/pages/score_distribution/score_distribution.html'),
            controller: 'scoreDistributionCtrl'
        })
*/
        /*----------------作业统计 End--------------------*/

        /*----------------游戏统计 Start--------------------*/
        /*.state('game_statistics_list', {                  //游戏统计主页面
            url: '/game_statistics_list/:category/:workType',
            template: require('./../partials/game_statistics/game_statistics_list.html'),
            controller: 'gameStatisticsListCtrl'
        })
        .state('game_stu_list', {                  //游戏学生完成情况统计
            url: '/game_stu_list',
            template: require('./../partials/game_statistics/game_stu_list.html'),
            controller: 'gameStuListCtrl'
        })
        .state('game_praise', {                  //游戏表扬
            url: '/game_praise',
            template: require('./../partials/game_statistics/game_praise.html'),
            controller: 'gamePraiseCtrl'
        })
        .state('game_stu_detail', {                  //学生做该游戏任务的当前进度
            url: '/game_stu_detail',
            template: require('./../partials/game_statistics/game_stu_detail.html'),
            controller: 'gameStuDetailCtrl'
        })
        .state('game_detail', {                  //学生做特定游戏的进度
            url: '/game_detail/:game',
            template: require('./../partials/game_statistics/game_detail.html'),
            controller: 'gameDetailCtrl'
        })
        .state('game_top_statistics', {                  //游戏高级统计
            url: '/game_top_statistics',
            template: require('./../partials/game_statistics/game_top_statistics.html'),
            controller: 'gameTopStatisticsCtrl'
        })*/


        /*----------------游戏统计 Start--------------------*/

        /*----------------游戏统计 End--------------------*/


        //作业试卷管理
       /* .state('homework_exam_lib', {                   //作业试卷库选择页面
            cache: false,
            url: 'homework_exam_lib',
            template: require('./../partials/work_lib_manage/homework_exam_lib.html'),
            controller: 'homeworkExamLibCtrl'
        })*/
        // .state('work_lib_list', {                     //作业试卷列表
        //     cache: false,
        //     url: '/work_lib_list',
        //     template: require('./../partials/work_lib_manage/work_lib_list.html'),
        //     controller: 'workLibListCtrl'
        // })
        // .state('about', { //班级详情
        //     url: '/about',
        //     template: require('./../partials/system_auth/about.html'),
        //     controller: 'aboutCtrl'
        // })


        //作业试卷管理
        // .state('work_camera_add_question', { //拍照出题
        //     url: '/work_camera_add_question',
        //     template: require('./../partials/work_lib_manage/work_camera_add_question.html')
        // })

       /*TODO 好像是没用的
       .state('paper-math', {
            url: '/paper-math/:id',
            template: require('./pages/paper_math/page.html'),
            controller: 'paperMath as ctrl'
        })
        .state('pub-math-paper', {
            url: '/pub-math-paper/:id/:title',
            template: require('./pages/pub_math_paper/page.html'),
            controller: 'pubMathPaper'
        })*/

       /* .state('select_clazz', { //游戏发布管理选择班级
            url: '/select_clazz',
            template: require('./../../t_game/scripts/pages/select_clazz/select_clazz.html'),
            controller: 'selectClazzCtrl'
        })*/
        /*.state('pass_game_situation', { //游戏统计
            url: '/pass_game_situation',
            template: require('./../../t_game/scripts/pages/pass_game_situation/pass_game_situation.html'),
            controller: 'passGameSituationCtrl'
        })*/
       /* .state('game_stat_more', { //游戏统计
            url: '/game_stat_more',
            template: require('./../../t_game/scripts/pages/game_stat_more/game_stat_more.html'),
            controller: 'gameStatMoreCtrl'
        })*/
        /*.state('game_remove', {
            url: '/game_remove',
            template: require('./../../t_game/scripts/pages/game_remove/game_remove.html'),
            controller: 'gameRemoveCtrl as ctrl'
        })*/

        /*--------------------------------------------------------*/
        // .state('clazz_control', { //游戏统计
        //     url: '/clazz_control',
        //     template: require('./../partials/clazz_control/clazz_control.html'),
        //     controller: 'clazzControlCtrl'
        // })
        /*----------------------教学群-------------------------*/
        // .state('teaching_group_list', {//教学群列表
        //     url: '/teaching_group_list',
        //     cache: false,
        //     template: require('./../partials/teaching_group/teaching_group_list.html'),
        //     controller: 'teachingGroupListCtrl as ctrl'
        // })

        // .state('q_feedback', { //作业明细--详情页面
        //     url: '/q_feedback',
        //     template: require('./../partials/work_statistics/q_feedback.html'),
        //     controller: 'qFeedbackCtrl as ctrl'
        // })
}]);
