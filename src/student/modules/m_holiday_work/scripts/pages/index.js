/**
 * Created by ww on 2018/1/5.
 */


import holidaySelectQuestionCtrl from './holiday_select_question';
import holidayDoQuestionCtrl from './holiday_do_question';
import holidayWorkDetailCtrl from './holiday_work_detail';
import HolidayWorkPraiseCtrl from './holiday_work_praise';
// import holidayWorkList from './holiday_work_list/index';
let controllers = angular.module('m_holiday_work.controllers',[]);
// controllers.controller('holidayWorkList',holidayWorkList);
controllers.controller('holidaySelectQuestionCtrl', holidaySelectQuestionCtrl);
controllers.controller('holidayDoQuestionCtrl', holidayDoQuestionCtrl);
controllers.controller('holidayWorkDetailCtrl', holidayWorkDetailCtrl);
controllers.controller('holidayWorkPraiseCtrl', HolidayWorkPraiseCtrl);
