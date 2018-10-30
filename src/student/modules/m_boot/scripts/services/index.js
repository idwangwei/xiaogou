/**
 * created by �?�� on 2015/7/23
 */
// import  'ionicJS';

import work_report_service from './work_report/work_report_service';
import increase_score_service from './increase_score_service';

// module.exports= angular.module('app.services', []);
let services = angular.module('m_boot.services', []);
services.service('workReportService',work_report_service)
        .service('increaseScoreService',increase_score_service);

module.exports = services;
// export default services;