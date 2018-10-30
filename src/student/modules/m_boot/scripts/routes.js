/**
 * Defines the main routes in the application.
 */
import m_boot from './app';
import * as STATE_NAME from './constants/state_name';

m_boot.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    $stateProvider
        /*.state('work_praise', { //作业评价
        url: '/work_praise/:workId/:workInstanceId',
        // views: {
        //     "study_index": {
        template: require('./../../m_work/scripts/pages/work_praise/work_praise.html'),
        controller: 'workPraiseCtrl as ctrl'
        // }
        // }

    })*/
    /*.state('system_login', { //系统登录
            url: '/system_login',
            template: require('./partials/system_auth/system_login.html'),
            controller: 'studentLoginCtrl as ctrl',
            resolve: ["$ocLazyLoad", function ($ocLazyLoad) {
                return $ocLazyLoad.load('home');
            }]
        })*/
        .state('clazz_select', {
            url: '/clazz_select',
            template: require('./partials/clazz_select.html'),
            controller: 'clazzListCtrl'
        })
        // .state('home', {
        //     url: '/home',
        //     abstract: true,
        //     template: require('./partials/home.html'),
        //     controller: 'stuHomeCtrl as ctrl'
        // })
        // .state('home.study_index', {
        //     url: '/study_index',
        //     views: {
        //         "study_index": {
        //             template: require('./partials/system_auth/study_index.html'),
        //             controller: 'studyIndexCtrl as ctrl'
        //         }
        //     }
        //     ///////////////////////////////////我///////////////////////////////////////////////
        // })
        .state('home.msg', {
            url: '/msg',
            views: {
                "msg": {
                    template: require('./partials/system_auth/message_list.html'),
                    controller: 'messageListCtrl as ctrl'
                }
            }
            ///////////////////////////////////我///////////////////////////////////////////////
        })
        /* .state('home.me', {
            url: '/me',
            views: {
                "me": {
                    template: require('./partials/system_auth/me.html'),
                    controller: 'meCtrl as ctrl'
                }
            }
        })*/

        /*.state(STATE_NAME.WORK_LIST, { //已发布作业
            url: '/work_list/:needUpdate/:fromUrl',
            views: {
                "study_index": {
                    template: require('./../../m_work/scripts/pages/work_list/work_list.html'),
                    controller: 'workListCtrl as ctrl'
                }
            }

        })*/
        // .state('home.jiexi', { //作业明细--整个作业查看
        //     url: '/jiexi',
        //     views: {
        //         "work_list": {
        //             template: require('./partials/jiexi.html')
        //         }
        //     }
        // })
       /* .state('clazz_study_statistics', { //作业明细--整个作业查看
            url: '/clazz_study_statistics',
            // views: {
            //     'work_list': {
            template: require('./../../m_work/scripts/pages/study_stati/clazz_study_statistics.html'),
            controller: 'studyStatiCtrl as ctrl'
            // }
            // }
        })*/
        /*.state('work_praise_detail', {                  //作业表扬
            url: '/work_praise_detail',
            // views: {
            //     "work_list": {
            template: require('./../../m_work/scripts/pages/work_praise_detail/work_praise_detail.html'),
            controller: 'workPraiseDetailCtrl as ctrl'
            // }
            // }

        })*/
       /* .state('work_detail', { //作业明细--整个作业查看
            cache: false,
            url: '/work_detail/:paperId/:paperInstanceId/:urlFrom',
            // views: {
            //     "": {
            template: require('./../../m_work/scripts/pages/work_detail/work_detail.html'),
            controller: 'workDetailCtrl as ctrl'
            // }
            // }

            /////////////////////////////////游戏/////////////////////////////////////////////////////////////
        })*/
       /* .state('select_question', { //选择试题
            url: '/select_question/:paperId/:paperInstanceId/:redoFlag/:urlFrom/:questionIndex/:urlFromMark',
            // views: {
            //     "work_list": {
            template: require('./../../m_work/scripts/pages/select_question/select_question.html'),
            controller: 'selectQuestionCtrl as ctrl'
            // }
            // }

        })*/
        /*.state('do_question', { //做题
            url: '/do_question/:paperId/:paperInstanceId/:redoFlag/:questionIndex/:urlFrom/:urlFromMark/:isFirst',
            // views: {
            //     "work_list": {
            template: require('./../../m_work/scripts/pages/do_question/do_quesiton.html'),
            controller: 'doQuestionCtrl as doCtrl'
            // }
            // }
        })*/
        /* .state(STATE_NAME.GAME_LIST, { //已发布游戏
            url: '/game_list',
            views: {
                "study_index": {
                    template: require('./partials/game/game_list.html'),
                    controller: 'gameListCtrl as ctrl'
                }
            }
        })*/
        /*.state('home.select_unit', { //选择单元
            url: '/select_unit',
            views: {
                "diagnose": {
                    template: require('./partials/diagnose/teaching_material.html'),
                    controller: 'selectUnitCtrl as ctrl'
                }
            }
        })*/
        /*.state(STATE_NAME.DIAGNOSE, { //已发布游戏
            url: '/diagnose',
            views: {
                "study_index": {
                    template: require('./partials/diagnose/diagnose.html'),
                    controller: 'diagnoseCtrl as ctrl'
                }
            }
        })*/
        /*.state('home.diagnose02', { //已发布游戏
            url: '/diagnose02/:backWorkReportUrl/:isIncreaseScore/:isIncreaseScorePaySuccess',
            views: {
                "study_index": {
                    template: require('./partials/diagnose_02/diagnose_02.html'),
                    controller: 'home.diagnose02Ctrl as ctrl'
                }
            }
        })*/

      /*  .state('diagnose_knowledge02', { //已发布游戏
            url: '/diagnose_knowledge02/:backWorkReportUrl/:isIncreaseScore',
            cache: true,
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose_02/diagnose_knowledge_02.html'),
            controller: 'diagnoseKnowledge02Ctrl as ctrl'
            // }
            // }
        })*/

       /* .state('diagnose_do_question02', { //已发布游戏
            url: '/diagnose_do_question02/:urlFrom/:pointName/:pointIndex/:backWorkReportUrl',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose_02/diagnose_do_question_02.html'),
            controller: 'diagnoseDoQuestion02Ctrl as doQCtrl'
            // }
            // }
        })*/

        /*.state('diagnose_report', { //已发布游戏
            url: '/diagnose_report/:urlFrom/:pointIndex/:pointName/:backWorkReportUrl',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose_02/diagnose_report.html'),
            controller: 'diagnoseReportCtrl as ctrl'
            // }
            // }
        })*/

       /* .state('diagnose_improve', { //已发布游戏
            url: '/diagnose_improve/:urlFrom',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose/diagnose_improve.html'),
            controller: 'diagnoseImproveCtrl as ctrl'
            // }
            // }
        })
        .state('diagnose_q_records', { //已发布游戏
            url: '/diagnose_q_records',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose/diagnose_q_records.html'),
            controller: 'diagnoseQRecordsCtrl as ctrl'
            // }
            // }
        })*/
       /* .state('diagnose_error_q_records', { //已发布游戏
            url: '/diagnose_error_q_records/:pointName/:backWorkReportUrl',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose/diagnose_error_q_records.html'),
            controller: 'diagnoseErrorQRecordsCtrl as ctrl'
            // }
            // }
        })*/
       /* .state('diagnose_do_question', { //已发布游戏
            url: '/diagnose_do_question',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose/diagnose_do_question.html'),
            controller: 'diagnoseDoQuestionCtrl as doQCtrl'
            // }
            // }
        })
        .state('diagnose_knowledge', { //已发布游戏
            url: '/diagnose_knowledge',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose/diagnose_knowledge.html'),
            controller: 'diagnoseKnowledgeCtrl as ctrl'
            // }
            // }
        })*/
       /* .state('diagnose_pay_ad', { //诊断的付费广告
            url: '/diagnose_pay_ad',
            // views: {
            //     "diagnose": {
            template: require('./partials/diagnose/diagnose_pay_ad.html'),
            controller: 'diagnosePayAdCtrl as ctrl'
            // }
            // }
        })*/

       /* .state('home.olympic_math_home', { //奥数主页
            url: '/olympic_math_home',
            views: {
                "study_index": {
                    template: require('./../../m_olympic_math_home/scripts/pages/olympic_math/olympic_math_home.html'),
                    controller: 'olympicMathHomeCtrl as ctrl'
                }
            }


        }).state('olympic_math_work_list', { //奥数作业列表
        url: '/olympic_math_work_list/:urlFrom',
        template: require('./../../m_olympic_math_home/scripts/pages/olympic_math/olympic_math_work_list.html'),
        controller: 'workListCtrl as ctrl'
    }).state('olympic_math_work-detail', { //奥数作业明细主页
        url: '/olympic_math_work-detail/:paperId/:paperInstanceId',
        template: require('./../../m_olympic_math_home/scripts/pages/olympic_math/olympic_math_work_detail.html'),
        controller: 'workDetailCtrl as ctrl'
    })*/


    /* .state('clazz_manage', { //班级列表
            url: '/clazz_manage',
            // views: {
            //     "me": {
            template: require('./partials/clazz_manage/clazz_list.html'),
            controller: 'clazzManageCtrl as ctrl'
            // }
            // }
        })
        .state('clazz_detail', { //班级详情
            url: '/clazz_detail',
            // views: {
            //     "me": {
            template: require('./partials/clazz_manage/clazz_detail.html'),
            controller: 'clazzDetailCtrl as ctrl'
            // }
            // }
        })*/
    /* .state('achievement', {
            url: '/achievement',
            // views: {
            //     "me": {
            template: require('./partials/achievement/achievement.html'),
            controller: 'achievementCtrl as ctrl'
            // }
            // }
        })*/
    /*.state('about', { //班级详情
            url: '/about',
            // views: {
            //     "me": {
            template: require('./partials/system_auth/about.html'),
            controller: 'aboutCtrl as ctrl'
            // }
            // }
        })*/
        /*.state('clear_local_data', {
            url: '/clear_local_data',
            template: require('./controllers/clear_local_data/clear_local_data.html'),
            controller: 'clearLocalDataCtrl as ctrl'
        })*/

    /* .state(STATE_NAME.COMPUTE, {
            "url": '/compute',
            views: {
                "study_index": {
                    template: require('./partials/system_auth/compute.html'),
                    controller: 'computeCtrl as ctrl'
                }
            }

        })*/

       /* .state('weixin_pay', {
            url: '/weixin_pay/:urlFrom/:backWorkReportUrl',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/weixin_pay.html'),
            controller: 'weixinPayCtrl as ctrl'
            // }
            // }
        })
        .state('weixin_pay_result', {
            url: '/weixin_pay_result/:orderType/:urlFrom/:backWorkReportUrl/:comeFrom/:xlyType',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/weixin_pay_result.html'),
            controller: 'weixinPayResult as ctrl'
            // }
            // }
        })
        .state('weixin_pay_protocol', {
            url: '/weixin_pay_protocol/:urlFrom/:backUrl/:backWorkReportUrl/:xlyType',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/weixin_pay_protocol.html'),
            controller: 'weixinPayProtocol as ctrl'
            // }
            // }
        })
        .state('weixin_pay_select', {
            url: '/weixin_pay_select/:urlFrom/:backWorkReportUrl/:isIncreaseScore',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/weixin_pay_select.html'),
            controller: 'weixinPaySelect as ctrl'
            // }
            // }
        })
        /!* .state('weixin_pay_detail', {
            url: '/weixin_pay_detail/:backWorkReportUrl',
            // views: {
            //     'diagnose': {
            template: require('./partials/weixin_pay/weixin_pay_detail.html'),
            controller: 'weixinPayDetail as ctrl'
            // }
            // }
        })*!/
        .state('group_buying', {
            url: '/group_buying/:urlFrom/:backWorkReportUrl',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/group_buying.html'),
            controller: 'groupBuying as ctrl'
            // }
            // }
        })
        .state('group_buying_create', {
            url: '/group_buying_create/:urlFrom/:backWorkReportUrl',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/group_buying_create.html'),
            controller: 'groupBuyingCreate as ctrl'
            // }
            // }
        })
        .state('group_buying_pay', {
            url: '/group_buying_pay/:urlFrom/:backWorkReportUrl',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/group_buying_pay.html'),
            controller: 'groupBuyingPay as ctrl'
            // }
            // }
        })
        .state('group_buying_result', {
            url: '/group_buying_result/:orderType/:urlFrom/:backWorkReportUrl',
            // views: {
            //     'diagnose': {
            template: require('./../../m_diagnose_payment/scripts/pages/weixin_pay/group_buying_result.html'),
            controller: 'groupBuyingResult as ctrl'
            // }
            // }
        })*/
       /* .state('wp_good_pay', {
            url: '/wp_good_pay/:urlFrom',
            template: require('./../../m_olympic_math_home/scripts/pages/weixin_pay_02/wp_good_pay.html'),
            controller: 'wpGoodPay as ctrl'
        })
        .state('wp_good_select', {
            url: '/wp_good_pay_select/:urlFrom',
            template: require('./../../m_olympic_math_home/scripts/pages/weixin_pay_02/wp_good_select.html'),
            controller: 'wpGoodSelect as ctrl'
        })
        .state('wp_good_pay_result', {
            url: '/wp_good_pay_result/:orderType/:urlFrom',
            template: require('./../../m_olympic_math_home/scripts/pages/weixin_pay_02/wp_good_pay_result.html'),
            controller: 'wpGoodPayResult as ctrl'
        })
        .state('wp_pay_protocol', {
            url: '/wp_pay_protocol/:urlFrom',
            template: require('./../../m_olympic_math_home/scripts/pages/weixin_pay_02/wp_pay_protocol.html'),
            controller: 'wpPayProtocol as ctrl'
        })*/

       /* .state('training-pets-master', {
            url: '/training-pets-master/:fromUrl',
            cache: false,
            template: require('./controllers/training_pets_master/index-page.html'),
            controller: 'trainingPetsMaster as ctrl'
        })*/
        .state('organize-paper', {
            url: '/organize-paper',
            template: require('./controllers/organize_paper/page.html'),
            controller: 'organizePaper as ctrl'
        })
       /* .state('personal-math', {
            url: '/personal-math/:from',
            template: require('./.././page.html'),
            controller: 'personalMath as ctrl'
        })
        .state('paper-detail', {
            url: '/paper-detail/:id/:title',
            template: require('./.././page.html'),
            cache: false,
            controller: 'paperDetail as ctrl'
        })*/
        /*.state('common-problem', {
            url: '/common-problem',
            template: require('./controllers/commonProblem/page.html'),
            controller: 'commonProblem as ctrl'
        })*/
        /*.state('stuPassLevels', {
            url: '/stuPassLevels?grade&classId&passLevels&stuName',
            cache: false,
            template: require('./controllers/compute/stu-pass-levels.html'),
            controller: 'stuPassLevelsCtrl as ctrl'
        })*/
        ///////////////////////////////////成长足迹///////////////////////////////////////////////
        /*.state(STATE_NAME.GROWING, { //成长足迹----一个班级的所有同学的足迹
            url: '/growing',
            views: {
                "growing": {
                    template: require('./../../m_growing/scripts/pages/growing/growing_all_student_home.html'),
                    controller: 'growingAllStudentHome as ctrl'
                }
            }
        })
        .state('growing_mySelf_home', { //成长足迹----我的主页
            url: '/growing_mySelf_home',
            // views: {
            //     "growing": {
            template: require('./../../m_growing/scripts/pages/growing/growing_auth_home.html'),
            controller: 'growingAuthHome as ctrl'
            // }
            // }
        })
        .state('growing_classmate_home', { //成长足迹----同学的主页
            url: '/growing_classmate_home/:gender/:headId',
            // views: {
            //     "growing": {
            template: require('./../../m_growing/scripts/pages/growing/growing_classmate_home.html'),
            controller: 'growingClassmateHome as ctrl'
            // }
            // }
        })
        .state('growing_pub_msg', { //成长足迹----发布消息
            url: '/growing_pub_msg',
            // views: {
            //     "growing": {
            template: require('./../../m_growing/scripts/pages/growing/growing_pub_msg.html'),
            controller: 'growingPubMsg as ctrl'
            // }
            // }
        })
        .state('growing_classmate_list', { //成长足迹----同学列表
            url: '/growing_classmate_list',
            // views: {
            //     "growing": {
            template: require('./../../m_growing/scripts/pages/growing/growing_classmate_list.html'),
            controller: 'growingClassmateList as ctrl'
            // }
            // }
        })*/


}]);
