/**
 * Created by Administrator on 2017/3/18.
 */

export default function (competitionModule) {
    competitionModule.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(false);
        $stateProvider.state('competition_report', { //竞赛报告
            url: '/competition_report',
            template: require('./../partials/competition_report/competition_report.html'),
            controller: 'competitionReportCtrl as ctrl'
        }).state('competition_work_detail', { //竞赛试卷批改结果页
            url: '/competition_work_detail',
            template: require('./../partials/competition_work_detail/competition_work_detail.html'),
            controller: 'competitionWorkListCtrl as ctrl'
        })
    }]);
}