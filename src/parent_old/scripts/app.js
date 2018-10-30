window.jQuery=require('jquery');
// import  'ionicJS';
import  'uuid';
import  'ionicDatePicker';
// import  'datePickerTemplate';
import  'platformDetector';
import  'QRCodeScaner';
import  'ios9Patch';
import  'compatiblePatch';
import  'onresumeHandler';
import  'allereMathJax';
// import  'allereKeyboard';
import  'allereKeyboardCss';
import  'allereEClassAppTextarea';
import  'correctPaperDirect';
import 'allereMarqueeDirect';
import  'correctPaperCss';
import  'commonConstants';
import  'commonWidgets/settingsButton.directive';
import  'ngRedux';

import  './constants/index';
import  './constants/constant';

import  './controllers/index';

import  './controllers/student_manage/student_register_ctrl';
import  './controllers/student_manage/student_registe_ctrl';

import  './controllers/student_manage/student_clazz_ctrl';
import  './controllers/student_manage/student_clazz_apply_ctrl';

import  './controllers/parent_manage/parent_login_ctrl';
import  './controllers/parent_manage/parent_register_ctrl';
import  './controllers/student_manage/student_edit_ctrl';
import  './controllers/student_manage/student_list_ctrl';
import  './controllers/parent_manage/register_success';
import  './controllers/student_manage/student_clazz_detail_ctrl';
import  './controllers/parent_manage/person_index_ctrl';


import  './controllers/reset_password/reset_pass_apply_ctrl';
import  './controllers/reset_password/reset_pass_ctrl';

import  './controllers/base_info_manage/base_info_first_ctrl';
import  './controllers/base_info_manage/basic_info_manage_ctrl';
import  './controllers/work_statistics/work_list_ctrl';
import  './controllers/work_statistics/work_detail_for_stat_ctrl';
import  './controllers/work_statistics/work_detail_ctrl';
import  './controllers/work_statistics/work_praise_ctrl';
import  './controllers/work_statistics/work_praise_detail_ctrl';
import  './controllers/student_manage/stu_settings_ctrl';
import  './controllers/student_manage/message_list_ctrl';
import  './controllers/student_manage/message_detail_ctrl';
import  './controllers/parent_manage/second_p_first_ctrl';
import  './controllers/parent_manage/change_device_login_ctrl';

import  './controllers/game_statistics/game_list_ctrl';
import  './controllers/game_statistics/game_statistics_ctrl';
import  './controllers/game_statistics/game_level_ctrl';
import  './controllers/parent_home/p_home_ctrl';
import './controllers/commonProblem';
import  './controllers/about/about_ctrl';
import  './controllers/about/feedback_ctrl';
import  './controllers/parent_manage/forget_user_name_ctrl';
import  './controllers/work_statistics/q_feedback_ctrl';
import './pages/index';
//import  './controllers/work_statistics/work_correct_ctrl';
import  './controllers/promote/promote_home';
import  './controllers/promote/xly_promote_home';
import  './controllers/promote/promote_agency_home';
import  './controllers/promote/promote_query';
import  './controllers/promote/promote_assets';
import  './controllers/promote/xly_promote_assets';
import  './controllers/promote/promote_person_direct';
import  './controllers/promote/promote_person_indirect';


import  './directives/dirctives_index';
import  './directives/index';
import  './directives/common/centerbox';
import  './directives/common/autobox';
import  './directives/common/autolist';
import  './directives/common/anchor';
import  './directives/common/sub_header';
import  './directives/common/common_password_directive';
import  './directives/common/stat_more_directive'
import  './directives/common/loading_processing'
import  './directives/validators/validators';
import  './directives/components/stat_circle_directive';
import  './directives/components/compile_html_directive';
import  './directives/components/input_area_directive';
import  './directives/components/select_input_area_directive';
import  './directives/common/datetime_picker';
import  './directives/components/home_layout_directive';
import  './directives/components/image_list_directive';
import  './directives/common/q_corret_ans_directive';
import  './directives/common/my_backdrop_directive';
import  './directives/common/focus_me';
import './directives/form/radio'
import './directives/list/expandItem'
import './directives/broadcast/broadcast-msg-item';
import './directives/holidayHomeworkAd/holidayHomeworkAd';
import  './directives/common/tabItem';

import  './filters/index';
import  './filters/sanitizeHtml-filter';
import  './filters/parseJSON-filter';

import  './services/index';
import  './services/profile_service';
import  './services/student_service';
import  './services/common/http_interceptor_service';
import  './services/common/date_util';
import  './services/bese_info_service';
import  './services/work_statistics_service';
import  './services/paper_service';
import  './services/common/common_service';
import  './services/message_service';
import  './services/jpush_manager';
import  './services/common/localstorage_db_util';
import  './services/game_service';
import  './services/promote_service';
// import  'allere-vertical-formula';
// import  'allere-linematch';
import 'competition/scripts/index';//引入竞赛模块
// import 'allere-open-class-02';

// import 'allereConstants/index'
import 'allereEClassKeyboard/index';
import 'allereLinematch/index';
import 'vertical-formula/index';
// import 'picture-drawing/index';
import 'ionicDatePicker';
// import "reward/scripts/index"; //引入积分模块
// import 'simplify_pull_exp/index'; //引入约分题模块

module.exports = angular.module('app', [
    'ui.router',
    'ionic',
    'uuid',
    'app.constants',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'ionic-datepicker',
    'ngIOS9UIWebViewPatch',
    'ngPlatformDetector',
    'ngQRCodeScaner',
    'ngIOS9UIWebViewPatch',
    'mathJaxParser',
    'allereEClassAppTextarea',
    'keyboard',
    'onresumeHandler',
    'compatiblePatch',
    'correctPaperDirective',
    'allereMarqueeDirective',
    'customButtons',
    'commonConstants',
    'ngRedux',
    'lineMatch',
    'verticalFormula',
    'competition',
    // 'reward',
    // 'simplifyPullExp.directive'

]);
