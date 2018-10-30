import profile from  './reducers/profile';
import wr_chapter_with_paperlist from  './reducers/work_repo/wr_chapter_with_paperlist.js';
import wr_fetch_paper_processing from  './reducers/work_repo/wr_fetch_paper_processing.js';
import wr_fetch_paperlist_processing from  './reducers/work_repo/wr_fetch_paperlist_processing.js';
import wr_fetch_textbook_processing from  './reducers/work_repo/wr_fetch_textbook_processing.js';
import wr_fetch_chapter_processing from  './reducers/work_repo/wr_fetch_chapter_processing.js';
import wr_gen_paper_criteria from  './reducers/work_repo/wr_gen_paper_criteria.js';
import wr_gen_paper_processing from  './reducers/work_repo/wr_gen_paper_processing.js';
import wr_selected_paper from  './reducers/work_repo/wr_selected_paper.js';
import wr_selected_unit from  './reducers/work_repo/wr_selected_unit.js';
import wr_selected_textbook from  './reducers/work_repo/wr_selected_textbook.js';
import wr_textbooks from  './reducers/work_repo/wr_textbooks.js';
import wr_unit_points from  './reducers/work_repo/wr_unit_points.js';
import wr_fetch_unit_points_processing from  './reducers/work_repo/wr_fetch_unit_points_processing.js';
import wr_selected_knowledge from  './reducers/work_repo/wr_selected_knowledge.js';
import wr_fetch_mine_paperlist_processing from  './reducers/work_repo/wr_fetch_mine_paperlist_processing.js';
import wr_gen_paper_data_processing from  './reducers/work_repo/wr_gen_paper_data_processing.js';

import gr_chapter_with_games  from "./reducers/game_repo/gr_chapter_with_games";
import gr_fetch_gamelist_processing from "./reducers/game_repo/gr_fetch_gamelist_processing";
import gr_fetch_textbook_processing from "./reducers/game_repo/gr_fetch_textbook_processing";
import gr_fetch_textbooks_processing from "./reducers/game_repo/gr_fetch_textbooks_processing";
import wr_fetch_paper_criteria_processing from "./reducers/work_repo/wr_fetch_paper_criteria_processing";
import gr_selected_textbook from "./reducers/game_repo/gr_selected_textbook";
import gr_textbook_detail_map from './reducers/game_repo/gr_textbook_detail_map';
import gr_textbooks from "./reducers/game_repo/gr_textbooks";
import gr_selected_chapter from "./reducers/game_repo/gr_selected_chapter";
import gr_chapter_gamelist_map from './reducers/game_repo/gr_chapter_gamelist_map';

import fetch_clazz_list_processing from './reducers/fetch_clazz_list_processing';
import wl_fetch_work_list_processing from './reducers/work_list/wl_fetch_work_list_processing';
import wl_clazz_list_with_work from './reducers/work_list/wl_clazz_list_with_work';
import wl_clazz_ae_list_with_work from './reducers/work_list/wl_clazz_ae_list_with_work';
import wl_selected_clazz from './reducers/work_list/wl_selected_clazz';
import wl_selected_work from './reducers/work_list/wl_selected_work';
import wl_page_info from './reducers/work_list/wl_page_info';
import clazz_list from './reducers/clazz_list';
import study_statis_params from './reducers/work_list/study_statis_params';
import teacher_credits_detail from './reducers/t_credits_store/teacher_credits_detail';

//gamelist-manage reducers
import game_list from './reducers/game_manage/game_list';
import wl_fetch_work_data_processing from './reducers/work_list/wl_fetch_work_data_processing'
import wl_fetch_student_list_processing from './reducers/work_list/wl_fetch_student_list_processing'
import work_statis_list from './reducers/work_list/work_statis_list'

// import teacher_user_info from './reducers/profile/teacher_user_info';
import profile_change_refer_cellphone_processing from './reducers/profile/profile_change_refer_cellphone_processing';
import profile_change_security_info_processing from './reducers/profile/profile_change_security_info_processing';
import profile_fetch_security_question_list_processing from './reducers/profile/profile_fetch_security_question_list_processing';
import profile_set_user_info_processing from './reducers/profile/profile_set_user_info_processing';
import profile_login_processing from './reducers/profile/profile_login_processing'
import profile_user_auth from './reducers/profile/profile_user_auth';
import game_statistics from './reducers/game_manage/game_statistics'
import gl_selected_clazz from './reducers/game_manage/gl_selected_clazz';
import force_gl_update_flag from './reducers/game_manage/force_gl_update_flag'
import gl_request_status from './reducers/game_manage/gl_request_status';
import wl_statistics_error_info from './reducers/work_list/wl_statistics_error_info';
import wl_fetch_statistics_error_info_processing from './reducers/work_list/wl_fetch_statistics_error_info_processing';


import cm_toggle_apply_tunnel_processing from './reducers/clazz_manager/cm_toggle_apply_tunnel_processing';
import cm_select_clazz_info from './reducers/clazz_manager/cm_select_clazz_info';
import cm_select_clazz_processing from './reducers/clazz_manager/cm_select_clazz_processing';
import cm_change_select_clazz_info_processing from './reducers/clazz_manager/cm_change_select_clazz_info_processing';
import cm_add_clazz_status from './reducers/clazz_manager/cm_add_clazz_status';
import cm_add_clazz_processing from './reducers/clazz_manager/cm_add_clazz_processing';
import cm_fetch_adding_stu_list_processing from './reducers/clazz_manager/cm_fetch_adding_stu_list_processing';
import cm_deal_add_stu_request_processing from './reducers/clazz_manager/cm_deal_add_stu_request_processing';
import cm_fetch_added_stu_list_processing from './reducers/clazz_manager/cm_fetch_added_stu_list_processing';
import cm_fetch_stu_detail_processing from './reducers/clazz_manager/cm_fetch_stu_detail_processing';
import cm_del_stu_processing from './reducers/clazz_manager/cm_del_stu_processing';
import cm_select_stu_detail from './reducers/clazz_manager/cm_select_stu_detail';
import cm_added_stu_list from './reducers/clazz_manager/cm_added_stu_list';
import cm_stu_level_change_processing from './reducers/clazz_manager/cm_stu_level_change_processing';
//速算统计
import rapid_calc_list from './reducers/rapid_calc/rapid_calc';
import rc_selected_clazz from './reducers/rapid_calc/rc_selected_clazz';
//获取学生列表
import student_list from './reducers/student_list/student_list';

import fetch_stu_work_report_processing from './reducers/stu_work_report/fetch_stu_work_report_processing';
import stu_work_report from './reducers/stu_work_report/stu_work_reports';
import knowledge_with_report from './reducers/stu_work_report/knowledge_with_report';
import change_diagnose_report_records_pagination_info from './reducers/stu_work_report/change_diagnose_report_records_pagination_info';

/**--------------------- diagnose start--------------------------**/
import diagnose_clazz_with_unit from './reducers/diagnose/diagnose_clazz_with_unit';
import diagnose_selected_clazz from './reducers/diagnose/diagnose_selected_clazz';
import diagnose_selected_textbook from './reducers/diagnose/diagnose_selected_textbook';
import diagnose_selected_unit from './reducers/diagnose/diagnose_selected_unit';
import diagnose_textbooks from './reducers/diagnose/diagnose_textbooks';
import diagnose_unit_has_changed from './reducers/diagnose/diagnose_unit_has_changed';
import fetch_diagnose_unit_processing from './reducers/diagnose/fetch_diagnose_unit_processing';
import fetch_student_diagnose_statistic_processing from './reducers/diagnose/fetch_student_diagnose_statistic_processing';
import fetch_diagnose_unit_stati_processing from './reducers/diagnose/fetch_diagnose_unit_stati_processing';
import unit_with_diagnose_stati from './reducers/diagnose/unit_with_diagnose_stati';
import stu_with_diagnose_stati from './reducers/diagnose/stu_with_diagnose_stati';
import diagnose_unit_select_knowledge from './reducers/diagnose/diagnose_unit_select_knowledge';
import knowledge_with_diagnose_stati from './reducers/diagnose/knowledge_with_diagnose_stati';
import fetch_dianose_unit_knowledge_stati_processing from './reducers/diagnose/fetch_dianose_unit_knowledge_stati_processing';
import fetch_diagnose_q_records_processing from './reducers/diagnose/fetch_diagnose_q_records_processing';
import diangnose_q_records_pagination_info from './reducers/diagnose/diangnose_q_records_pagination_info';
import diagnose_unit_select_stu from './reducers/diagnose/diagnose_unit_select_stu';
import diagnose_knowledge_select_stu from './reducers/diagnose/diagnose_knowledge_select_stu';
import stu_with_records_diagnose from './reducers/diagnose/stu_with_records_diagnose';
import fetch_diagnose_textbook_processing from './reducers/diagnose/fetch_diagnose_textbook_processing';

/**--------------------- diagnose end--------------------------**/

/**--------------------- moreInfo start--------------------------**/

import clazz_year_with_trophy_rank from './reducers/more_info/clazz_year_with_trophy_rank';
import fetch_trophy_rank_data_processing from './reducers/more_info/fetch_trophy_rank_data_processing';
import trophy_selected_clazz from './reducers/more_info/trophy_selected_clazz';
import trophy_selected_time from './reducers/more_info/trophy_selected_time';

/**--------------------- moreInfo end--------------------------**/

import eq_selected_chapter from  './reducers/work_repo/eq_selected_chapter.js';
import eq_selected_condition from  './reducers/work_repo/eq_selected_condition.js';
import eq_redo_creating_paper from  './reducers/work_repo/eq_redo_creating_paper.js';
import eq_selected_redo_paper from  './reducers/work_repo/eq_selected_redo_paper.js';
import eq_data_with_clazz from  './reducers/work_repo/eq_data_with_clazz.js';
import eq_paper_with_clazz from  './reducers/work_repo/eq_paper_with_clazz.js';

// import mo_selected_clazz from './reducers/math_oly/mo_selected_clazz';
// import mo_clazz_list from './reducers/math_oly/mo_clazz_list';
// import mo_work_list_with_clazz from './reducers/math_oly/mo_work_list_with_clazz';
// import om_cm_added_stu_list from './reducers/olympiad_math_clazz_manager/om_cm_added_stu_list';
// import om_cm_processing from './reducers/olympiad_math_clazz_manager/om_cm_processing';
import sharding_clazz from './reducers/sharding_clazz/sharding_clazz';
import clazz_with_game_star_rank_data from './reducers/game_manage/clazz_with_game_star_rank_data';
import fetch_game_star_rank_data_processing from './reducers/game_manage/fetch_game_star_rank_data_processing';
// import clazz_with_fighter_rank_data from '../../../t_compute/scripts/redux/reducers/clazz_with_fighter_rank_data';
// import fetch_fighter_rank_data_processing from '../../../t_compute/scripts/redux/reducers/fetch_fighter_rank_data_processing';

import teacher_share_info from './reducers/teacher_share_info';
import auto_comment_info from './reducers/work_list/auto_comment_info';


import compose_temp_paper from './reducers/compose_paper_diff_unit/compose_temp_paper';
import compose_multi_unit_paper from './reducers/compose_multi_units_paper/compose_multi_unit_paper';

import holiday_clazz_list_with_work from './reducers/work_list/holiday_clazz_list_with_work';


let rootReducer = {
    profile
    , wr_chapter_with_paperlist
    , wr_fetch_paper_processing
    , wr_fetch_paperlist_processing
    , wr_fetch_textbook_processing
    , wr_fetch_chapter_processing
    , wr_fetch_paper_criteria_processing
    , wr_gen_paper_criteria
    , wr_gen_paper_processing
    , wr_selected_paper
    , wr_selected_unit
    , wr_selected_textbook
    , wr_textbooks

    , gr_chapter_with_games
    , gr_textbook_detail_map
    , gr_fetch_gamelist_processing
    , gr_fetch_textbook_processing
    , gr_fetch_textbooks_processing
    , gr_selected_textbook
    , gr_textbooks
    , gr_selected_chapter
    , gr_chapter_gamelist_map
    , wr_unit_points
    , wr_fetch_unit_points_processing
    , wr_selected_knowledge
    , wr_fetch_mine_paperlist_processing
    , wr_gen_paper_data_processing

    , fetch_clazz_list_processing
    , wl_fetch_work_list_processing
    , wl_clazz_list_with_work
    , wl_clazz_ae_list_with_work
    , wl_selected_clazz
    , wl_selected_work
    , clazz_list
    , game_list
    , wl_page_info
    , wl_fetch_work_data_processing
    , wl_fetch_student_list_processing
    , work_statis_list
    , study_statis_params
    // , teacher_user_info
    , profile_change_refer_cellphone_processing
    , profile_change_security_info_processing
    , profile_fetch_security_question_list_processing
    , profile_set_user_info_processing
    , profile_login_processing
    , profile_user_auth
    , game_statistics
    , gl_selected_clazz
    , gl_request_status
    , wl_statistics_error_info
    , wl_fetch_statistics_error_info_processing

    ,cm_toggle_apply_tunnel_processing
    ,cm_select_clazz_info
    ,cm_select_clazz_processing
    ,cm_change_select_clazz_info_processing
    ,cm_add_clazz_status
    ,cm_add_clazz_processing
    ,cm_fetch_adding_stu_list_processing
    ,cm_deal_add_stu_request_processing
    ,cm_fetch_added_stu_list_processing
    ,cm_fetch_stu_detail_processing
    ,cm_del_stu_processing
    ,cm_select_stu_detail
    ,cm_added_stu_list
    ,cm_stu_level_change_processing
    ,force_gl_update_flag
    ,rapid_calc_list
    ,rc_selected_clazz
    ,student_list    ,diagnose_clazz_with_unit
    ,diagnose_selected_clazz
    ,diagnose_selected_textbook
    ,diagnose_selected_unit
    ,diagnose_textbooks
    ,diagnose_unit_has_changed
    ,fetch_diagnose_unit_processing
    ,fetch_diagnose_unit_stati_processing
    ,stu_with_diagnose_stati
    ,unit_with_diagnose_stati
    ,diagnose_unit_select_knowledge
    ,knowledge_with_diagnose_stati
    ,diagnose_unit_select_stu
    ,diagnose_knowledge_select_stu
    ,fetch_student_diagnose_statistic_processing
    ,fetch_dianose_unit_knowledge_stati_processing
    ,fetch_diagnose_q_records_processing
    ,diangnose_q_records_pagination_info
    ,stu_with_records_diagnose
    ,fetch_diagnose_textbook_processing
    ,clazz_year_with_trophy_rank
    ,fetch_trophy_rank_data_processing
    ,trophy_selected_clazz
    ,trophy_selected_time
    ,eq_selected_chapter
    ,eq_selected_condition
    ,eq_redo_creating_paper
    ,eq_selected_redo_paper
    ,eq_data_with_clazz
    ,eq_paper_with_clazz
    // ,mo_selected_clazz
    // ,mo_clazz_list
    // ,mo_work_list_with_clazz
    // ,om_cm_added_stu_list
    // ,om_cm_processing
    ,sharding_clazz
    ,clazz_with_game_star_rank_data
    ,fetch_game_star_rank_data_processing
    // ,clazz_with_fighter_rank_data
    // ,fetch_fighter_rank_data_processing
    ,teacher_share_info
    ,fetch_stu_work_report_processing
    ,stu_work_report
    ,knowledge_with_report
    ,change_diagnose_report_records_pagination_info
    ,auto_comment_info
    ,compose_temp_paper
    ,compose_multi_unit_paper
    ,holiday_clazz_list_with_work
    ,teacher_credits_detail
};

export default rootReducer;