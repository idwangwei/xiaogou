/**
 * Created by ZL on 2017/3/18.
 */

import competitionReportCtrl from './competition_report_ctrl'
import competitionWorkListCtrl from './competition_work_detail_ctrl';
let controllers = angular.module('competition.controllers', []);
controllers.controller("competitionReportCtrl", competitionReportCtrl);
controllers.controller("competitionWorkListCtrl", competitionWorkListCtrl);
