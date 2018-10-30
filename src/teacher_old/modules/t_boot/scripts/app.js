import 'ngDecorator/decoratorModule';
import 'underscore';
import 'angularSanitize';
import 'allereMathJax';
import 'ionicDatePicker';
import 'ionicTimePicker';
import 'ios9Patch';
import 'compatiblePatch';
import 'allereMarqueeDirect';
import 'angular-animate';
import 'oc-lazy-load/index';

import 'platformDetector';
import 'allereKeyboardCss';
import 'allereEClassAppTextarea';
import 'correctPaperDirect';
import 'correctPaperCss';
import 'pieChartDirect';
import 'uuid';
import 'QRCodeScaner';
import 'onresumeHandler';
import 'commonConstants';
import 'commonWidgets/settingsButton.directive';
import 'local_store/ngLocalStore';
import 'pageRefreshManager/pageRefreshManager';
import  './http_interceptors/index';


import './constants/index';
import './constants/constant';
// import './controllers/index';
// import './pages/index';
// import './controllers/clazz/send_class_pass_ctrl';
// import './controllers/teacher_register/register_success_ctrl';
// import './controllers/teacher_register/forget_user_name_ctrl';
// import '../../t_user_auth/scripts/pages/reset_pass_apply/reset_pass_apply_ctrl';
// import './controllers/base_info_manage/base_info_first_ctrl';
// import '../../t_user_auth/scripts/pages/reset_pass/reset_pass_ctrl';
// import '../../t_user_auth/scripts/pages/reset_pass_status/reset_pass_status';
// import './controllers/work_lib_manage/homework_exam_lib_ctrl';
// import './controllers/work_lib_manage/work_lib_list_ctrl';
// import './controllers/clazz/clazz_backup_work_ctrl';
// import './controllers/clazz/clazz_backup_work_detail_ctrl';
// import './pages/pub_math_paper/index'
// import './controllers/common/set_work_info_ctrl';
// import './controllers/common/work_select_tags_ctrl';
// import './controllers/common/select_game_ctrl';
// import './controllers/clazz/clazz_backup_game_ctrl';
// import './controllers/clazz/clazz_ctrl';
// import './controllers/clazz/clazz_backup_game_detail_ctrl';
// import '../../t_game/scripts/pages/game_pub/game_pub_ctrl';
// import './controllers/common/new_work_ctrl';
// import '../../t_game/scripts/pages/select_clazz/select_clazz_ctrl';
// import '../../t_game/scripts/pages/pass_game_situation/pass_game_situation_ctrl';
// import '../../t_home_teaching_work/scripts/pages/work_praise_detail/work_praise_detail_ctrl';
// import './controllers/game_statistics/game_statistics_list_ctrl';
// import './controllers/game_statistics/game_stu_list_ctrl';
// import './controllers/game_statistics/game_praise_ctrl';
// import './controllers/game_statistics/game_stu_detail_ctrl';
// import './controllers/game_statistics/game_detail_ctrl';
// import './controllers/game_statistics/game_top_statistics_ctrl';
// import '../../t_home_teaching_work/scripts/pages/score_distribution/score_distribution_ctrl';
// import '../../t_game/scripts/pages/game_stat_more/game_stat_more_ctrl';
// import './controllers/about/about_ctrl';
// import '../../t_game/scripts/pages/game_remove/game_remove_ctrl';
// import './controllers/teaching_group/teaching_group_list_ctrl';


import './directives/index';
import './directives/common/centerbox';
import './directives/common/autobox';
import './directives/common/autolist';
import './directives/common/autocolor';
import './directives/common/anchor';
import './directives/common/autoheight_directive';
import './directives/common/my_backdrop_directive';
import './directives/validators/confirm_pass';
import './directives/work_lib_manage/questionList';
import './directives/common/selectMonth';
import './directives/work_lib_manage/autoList';
import './directives/common/loading_processing';
import './directives/common/input_area_directive';
import './directives/common/compile_html_directive';
import './directives/work_lib_manage/select_input_area_directive';
import './directives/work_lib_manage/stat_more_directive';
import './directives/common/backdrop_for_assist_directive';
import './directives/common/sub_header';
import './directives/common/q_corret_ans_directive';
// import './directives/date_time_picker/datepicker';
import './directives/common/focus_me';
import './directives/shareBtn'
import './directives/broadcast/broadcast-msg-item';
import './directives/form/select';
import './directives/rankAlertBox/game_star_rank';
import './directives/rankAlertBox/compute_fighter_rank';
import './directives/teaching-guide/teaching-guide';
import './directives/form/listSelect';
import './directives/recommend_training_pets/recommend_training_pets';
import './directives/holidayHomeworkAd/holidayHomeworkAd';
import './directives/teacher_personal_qb_ad/index';

import './filters/index';
import './filters/sanitizeHtml-filter';
import './filters/parseJSON-filter';
import './services/index';
// import './services/clazz/send_class_pass_service';
import './services/profile_service';
import './services/profile/teacher_profile_service';
import './services/clazz_service';
import './services/common/common_service';
import './services/bese_info_service';
import './services/common/date_util';
import './services/family_service';
import './services/work_manage_service';
import './services/game_manage_service';
// import '../../t_game/scripts/services/game_statistics_service';
import './services/work_statistics_service';
import './services/common/localstorage_db_util';
// import './services/teaching_group_service';
// import './pages/organize_paper/service'


import 'ionicCss';
import '../less/theme02/app.less';
import 'appTextareaCss';

// import 'ngRedux';
import 'ngReduxForStudent';

import 'clazzToolBar';

import 'draft2';
import 'competition/scripts/index';//引入竞赛模块

import 'allereEClassKeyboard/index';
import 'allereLinematch/index';
import 'vertical-formula/index';
import {oralCalculationModule} from  'oral_calculation/scripts/index'; //引入口算模块

import 'allereSelectDateTime/index';
// import {creditsStoreModule,creditsStoreReducers} from 'credits_store/scripts/index';//教师端积分商城
import rootReducer from './redux/index';
import 'teaching_board/index';


function mergeReducers() {
    let rootReducers = {};
    Object.assign(rootReducers,rootReducer/*,creditsStoreReducers*/);
    return rootReducers;
}
let rootReducers = mergeReducers();
let appModule = angular.module('app', [
    'ui.router',
    'ionic',
    'ngSanitize',
    'ngIOS9UIWebViewPatch',
    'ionic-datepicker',
    'ionic-timepicker',
    'app.constants',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'mathJaxParser',
    'allereEClassAppTextarea',
    'pageRefreshManager',
    'uuid',
    'keyboard',
    'ngPlatformDetector',
    'ngQRCodeScaner',
    'correctPaperDirective',
    'allereMarqueeDirective',
    'onresumeHandler',
    'compatiblePatch',
    'customButtons',
    'commonConstants',
    'ngRedux',
    'ngLocalStore',
    'verticalFormula',
    'ngDecModule',
    'ngAnimate',
    'lineMatch',
    'pieChartDirective',
    'ngHttpInterceptors',
    'draftPainter2',
    'competition',
    'oralCalculation',
    'alrSelectDateTime',
    // 'creditsStore',
    'oc.lazyLoad',
    'teachingBoard'
]);


// export default appModule;
export {appModule, rootReducers}
export default appModule;