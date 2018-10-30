/**
 * Defines the main routes in the application.
 */
define(['./app'], function (app) {
    'use strict';
    app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/system_login');

        $stateProvider.state('home', {
                cache:false,//配置页面缓存
                url: '/home',
                template: require('./../partials/home.html'),
                controller: 'pHomeCtrl'
            })  //系统

            .state('system_login', { //家长登录
                cache:false,
                url: '/system_login',
                template: require('./../partials/system_auth/system_login.html'),
                controller: 'parentLoginCtrl'

            }).state('stu_settings', { //注册
            cache:false,
            url: '/stu_settings',
            template: require('./../partials/system_auth/stu_settings.html'),
            controller: 'stuSettingsCtrl'

        }).state('register', { //注册
            cache:false,
            url: '/register',
            template: require('./../partials/system_auth/register.html'),
            controller: 'parentRegisterCtrl as ctrl'

        }).state('register_success', {//注册成功
            cache:false,
            url: '/register_success/:loginName/:flag',
            template: require('./../partials/system_auth/register_success.html'),
            controller: 'registerSuccess'
        }).state('forget_user_name', {//注册成功
            cache:false,
            url: '/forget_user_name',
            template: require('./../partials/system_auth/forget_user_name.html'),
            controller: 'forgetUserNameCtrl'
        }).state('basic_info_first', { //第一次登陆成功
            cache:false,
            url: '/basic_info_first',
            template: require('./../partials/personal/basic_info_first.html'),
            controller: 'baseInfoFirstCtrl'
        }).state('basic_info_manage', { //个人中心
            cache:false,
                url: '/basic_info_manage',
                template: require('./../partials/personal/basic_info_manage.html'),
                controller: 'baseInfoManageCtrl'
            })
            .state('reset_pass', { //重置密码
                cache:false,
                url: '/reset_pass',
                template: require('./../partials/system_auth/reset_pass.html'),
                controller: 'resetPassCtrl'
            })
            .state('reset_pass_apply', { //重置密码
                cache:false,
                url: '/reset_pass_apply/:loginName/:phone',
                template: require('./../partials/system_auth/reset_pass_apply.html'),
                controller: 'resetPassApplyCtrl'
            })
            .state('add_child', { //添加学生;
                cache:false,
                url: '/add_child',
                template: require('./../partials/system_auth/add_child.html'),
                controller: 'studentRegisteCtrl'
            })
            .state('edit_child', { //修改学生;
                cache:false,
                url: '/edit_child',
                template: require('./../partials/system_auth/edit_child.html'),
                controller: 'studentEditCtrl'
            })
            .state('child_class_list', { //学生班级列表
                cache:false,
                url: '/child_class_list/:sid',
                template: require('./../partials/system_auth/child_class_list.html'),
                controller: 'studentClassCtrl'
            })
            .state('child_class_detail', { //学生班级明细
                cache:false,
                url: '/child_class_detail',
                template: require('./../partials/system_auth/child_class_detail.html'),
                controller: 'studentClazzDetailCtrl'
            })
            .state('child_class_apply', { //学生申请加入班级
                cache:false,
                url: '/child_class_apply/:sid',
                template: require('./../partials/system_auth/child_class_apply.html'),
                controller: 'studentClassApplyCtrl'
            }).state('home.msg', { //消息列表
            cache:false,
            url: '/msg',
            views: {
                "message_list": {
                    template: require('./../partials/system_auth/message_list.html'),
                    controller: 'messageListCtrl'
                }
            }
        }).state('message_detail', { //消息明细
            cache:false,
            url: '/message_detail',
            template: require('./../partials/system_auth/message_detail.html'),
            controller: 'messageDetailCtrl'
        }).state('second_p_first', { //第二监护人第一次登陆
            cache:false,
            url: '/second_p_first',
            template: require('./../partials/system_auth/second_p_first.html'),
            controller: 'secondPFirstCtrl'
        }).state('change_device_login', { //更换设备进行登录
            cache:false,
            url: '/change_device_login',
            template: require('./../partials/system_auth/change_device_login.html'),
            controller: 'changeDetviceLoginCtrl'
        }).state('home.person_index', { //家长主页
            cache:false,
            url: '/person_index',
            views: {
                "person_index": {
                    template: require('./../partials/personal/person_index.html'),
                    controller: 'personIndexCtrl'
                }
            }
        }).state('about', { //班级详情
            cache:false,
                url: '/about',
                template: require('./../partials/system_auth/about.html'),
                controller: 'aboutCtrl'
            })
            /*---------------------------------孩子情况---------------------------------------------------*/
            .state('home.child_index', {
                cache:false,
                url: '/child_index',
                views: {
                    "child_index": {
                        template: require('./../partials/child/child_index.html'),
                        controller: 'studentListCtrl'
                    }
                }
            })
            .state('feedback', {
                cache:false,
                url: '/feedback',
                template: require('./../partials/feedback.html'),
                controller:'feedbackCtrl as ctrl'
            })
            /*--------------------------------------------------------------------------------------------*/

            /*---------------------------------作业管理---------------------------------------------------*/
            .state('home.work_list', { //作业列表
                cache:false,
                url: '/work_list/:sId/:sName',
                views: {
                    "work_list": {
                        template: require('./../partials/work_statistics/work_list.html'),
                        controller: 'workListCtrl'
                    }
                }
            })
            .state('work_detail_for_stat', { //作业明细--批改统计页面
                cache:false,
                url: '/work_detail_for_stat/:workId/:workInstanceId',
                template: require('./../partials/work_statistics/work_detail_for_stat.html'),
                controller: 'workDetailForStatCtrl'
            })
            .state('work_detail', { //作业明细--批改统计页面
                cache:false,
                url: '/work_detail/:workId/:workInstanceId/:workStatus',
                template: require('./../partials/work_statistics/work_detail.html'),
                controller: 'workDetailCtrl'
            })
            .state('q_feedback', { //作业明细--详情页面
                cache:false,
                url: '/q_feedback',
                template: require('./../partials/work_statistics/q_feedback.html'),
                controller: 'qFeedbackCtrl as ctrl'
            })
            .state('work_praise', { //作业明细--详情页面
                cache:false,
            url: '/work_praise',
            template: require('./../partials/work_statistics/work_praise.html'),
            controller: 'workPraiseCtrl'
        })
            .state('work_praise_detail', {                  //作业表扬
                cache:false,
                url: '/work_praise_detail',
                template: require('./../partials/work_statistics/work_praise_detail.html'),
                controller: 'workPraiseDetailCtrl'
            })
            ////            .state('child_request',{
            //                url:'child_request',
            //                template:require('./../partials/child/child_request.html)'
            //            })

            /*-------------------------------------游戏管理-------------------------------------------------------*/
            .state('home.game_list', {
                cache:false,
                url: '/game_list',
                views: {
                    "game_list": {
                        template: require('./../partials/game_statistics/game_list.html'),
                        controller: 'gameListCtrl'
                    }
                }
            })

            .state('game_statistics', {
                cache:false,
                url: '/game_statistics',
                template: require('./../partials/game_statistics/game_statistics.html'),
                controller: 'gameStatisticsCtrl'
            })
            .state('game_level', {
                cache:false,
                url: '/game_level',
                template: require('./../partials/game_statistics/game_level.html'),
                controller: 'gameLevelCtrl'
            })


        /*-------------------------------------推广-------------------------------------------------------*/
            .state('promote_agency_home', { //代理专页
                cache:false,
                url: '/promote_agency_home',
                template: require('./../partials/promote/promote_agency_home.html'),
                controller: 'promoteAgencyHomeCtrl as ctrl'
            })
            .state('promote_query', { //查询
                cache:false,
                url: '/promote_query',
                template: require('./../partials/promote/promote_query.html'),
                controller: 'promoteQueryCtrl as ctrl'
            })
            .state('promote_assets', { //我的资产
                cache:false,
                url: '/promote_assets',
                template: require('./../partials/promote/promote_assets.html'),
                controller: 'promoteAssetsCtrl as ctrl'
            })
            .state('xly_promote_assets', { //我的资产
                cache:false,
                url: '/xly_promote_assets',
                template: require('./../partials/promote/xly_promote_assets.html'),
                controller: 'xlyPromoteAssetsCtrl as ctrl'
            })
            .state('promote_home', { //推广有奖 （暂时不用）
                cache:false,
                url: '/promote_home',
                template: require('./../partials/promote/promote_home.html'),
                controller: 'promoteHomeCtrl as ctrl'
            })
            .state('xly_promote_home', { //训练营推广
                cache:false,
                url: '/xly_promote_home',
                template: require('./../partials/promote/xly_promote_home.html'),
                controller: 'xlyPromoteHomeCtrl as ctrl'
            })
            .state('promote_person_direct', { //直接推广人
                cache:true,
                url: '/promote_person_direct',
                template: require('./../partials/promote/promote_person_direct.html'),
                controller: 'promoteDirectPersonCtrl as ctrl'
            })
            .state('promote_person_indirect', { //间接推广人
                cache:false,
                url: '/promote_person_indirect',
                template: require('./../partials/promote/promote_person_indirect.html'),
                controller: 'promoteIndirectPersonCtrl as ctrl'
            })
            .state('commonProblem', {
                url: '/common-problem',
                cache: false,
                template: require('./../partials/personal/commonProblem.html'),
                controller: 'commonProblem'
            })
            .state('holiday_work_list',{
                url: '/holiday_work_list',
                cache: false,
                template: require('./pages/holiday_work_list/page.html'),
                controller: 'holidayWorkListCtrl as ctrl'
            })
        ;
    }]);
});