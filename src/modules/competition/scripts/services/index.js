/**
 * Created by ZL on 2017/3/20.
 */
import competitionReportService from './competition_report_service';
import countDownService from './count_down_service';
let services = angular.module('competition.services', []);
services.service("competitionReportService", competitionReportService);
services.service("countDownService",["$rootScope","commonService","$injector","$state",'$ngRedux','finalData',countDownService]);