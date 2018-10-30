/**
 * Created by ZL on 2018/1/5.
 */

import app_info from './reducers/app_info';
import feedback from './reducers/feedback';

import wl_clazz_list_with_works from './reducers/work_list/clazz_list_with_works';
import wl_is_fetch_status_loading from './reducers/work_list/wl_is_fetch_status_loading';
import wl_pagination_info from './reducers/work_list/pagination_info';
import wl_selected_clazz from './reducers/work_list/selected_clazz';
import wl_selected_work from './reducers/work_list/selected_work';
import wl_is_worklist_loading from './reducers/work_list/is_worklist_loading';
import wl_class_with_pagination_info from './reducers/work_list/wl_class_with_pagination_info';
import wl_is_fetch_paper_loading from './reducers/work_detail/is_fetch_paper_loading';
import wl_is_fetch_doPaper_loading from './reducers/work_detail/is_fetch_doPaper_loading';
import wl_is_paper_submitting from './reducers/do_paper/is_paper_submitting';
import wl_is_post_answer_loading from './reducers/do_paper/is_post_answer_loading';
import wl_is_student_praise_loading from './reducers/do_paper/is_student_praise_loading';


import wl_is_local_ans_changed from './reducers/do_paper/is_local_ans_changed.js';


import profile_achievement from './reducers/profile/achievement';
import profile_clazz from './reducers/profile/clazz';
import profile_user_auth from './reducers/profile/user_auth';
import clazz_with_study_stati from './reducers/study_stati/clazz_with_study_stati';
import fetch_study_stati_processing from './reducers/study_stati/fetch_study_stati_processing';
import study_statis_params from './reducers/study_stati/study_statis_params';


import unit from './reducers/unit';

import wl_paper_answer from './reducers/do_paper/wl_paper_answer';
import trophy_selected_clazz from './reducers/info/trophy_selected_clazz';
import fetch_trophy_rank_data_processing from './reducers/info/fetch_trophy_rank_data_processing';
import clazz_year_with_trophy_rank from './reducers/info/clazz_year_with_trophy_rank';
import trophy_selected_time from './reducers/info/trophy_selected_time';
/*

import olympic_math_selected_clazz from '../../../m_olympic_math_home/scripts/redux/reducers/olympic_math/olympic_math_selected_clazz';
import olympic_math_selected_grade from '../../../m_olympic_math_home/scripts/redux/reducers/olympic_math/olympic_math_selected_grade';
import work_list_route from '../../../m_olympic_math_home/scripts/redux/reducers/olympic_math/work_list_route';

*/

import clazz_with_game_star_rank_data from './reducers/info/clazz_with_game_star_rank_data';
import fetch_game_star_rank_data_processing from './reducers/info/fetch_game_star_rank_data_processing';
import clazz_with_fighter_rank_data from './reducers/info/clazz_with_fighter_rank_data';
import fetch_fighter_rank_data_processing from './reducers/info/fetch_fighter_rank_data_processing';
import selected_good from './reducers/profile/selected_good.js';
/*import wxpay_created_order_info from '../../../m_diagnose_payment/scripts/redux/reducers/wxpay_created_order_info';
import wxpay_create_order_info_processing from '../../../m_diagnose_payment/scripts/redux/reducers/wxpay_create_order_info_processing';
import wxpay_query_order_processing from '../../../m_diagnose_payment/scripts/redux/reducers/wxpay_query_order_processing';
import wxpay_detail_fetch_processing from '../../../m_diagnose_payment/scripts/redux/reducers/wxpay_detail_fetch_processing';
import wxpay_detail_list from '../../../m_diagnose_payment/scripts/redux/reducers/wxpay_detail_list';*/
// import group_buying_goods_list from '../../../m_diagnose_payment/scripts/redux/reducers/group_buying_goods_list';
// import group_buying_goods_list_fetch_processing from '../../../m_diagnose_payment/scripts/redux/reducers/group_buying_goods_list_fetch_processing';
// import group_buying_selected_good from '../../../m_diagnose_payment/scripts/redux/reducers/group_buying_selected_good';
// import group_buying_created_order_info from '../../../m_diagnose_payment/scripts/redux/reducers/group_buying_created_order_info';
// import group_buying_create_order_info_processing from '../../../m_diagnose_payment/scripts/redux/reducers/group_buying_create_order_info_processing';
// import query_group_buying_order_processing from '../../../m_diagnose_payment/scripts/redux/reducers/query_group_buying_order_processing';
import fetch_wei_xin_pay_02_goods_processing from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/fetch_wei_xin_pay_02_goods_processing';
import fetch_wei_xin_pay_02_create_order_processing from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/fetch_wei_xin_pay_02_create_order_processing';
import fetch_wei_xin_pay_02_order_processing from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/fetch_wei_xin_pay_02_order_processing';
import wei_xin_pay_02_select_good from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/wei_xin_pay_02_select_good';
import wei_xin_pay_02_created_order_info from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/wei_xin_pay_02_created_order_info';
import mo_goods_menus_list from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/mo_goods_menus_list';
import wei_xin_pay_02_select_grade from '../../../m_olympic_math_home/scripts/redux/reducers/weixin_pay_02/wei_xin_pay_02_select_grade';

import sharding_clazz from './reducers/sharding_clazz/sharding_clazz';

import user_reward_base from './reducers/profile/user_reward_base'
import get_user_reward_base_processing from './reducers/profile/get_user_reward_base_processing'
import fetch_level_name_list_processing  from './reducers/profile/fetch_level_name_list_processing'
import level_name_list  from './reducers/profile/level_name_list'
import update_user_reward_base_processing  from './reducers/profile/update_user_reward_base_processing'

import work_report_info from './reducers/work_report/work_report_info'
import ques_record from './reducers/work_report/ques_record'
import select_work_knowledge from './reducers/work_report/select_work_knowledge'
import diagnose_ad_dialog_flag from './reducers/work_report/diagnose_ad_dialog_flag'
import smart_training_camp_info from './reducers/training_camp/smart_training_camp_info'
import get_smart_training_camp_reward_processing from './reducers/training_camp/get_smart_training_camp_reward_processing'
import diagnose_camp_goods from './reducers/xly/diagnose_camp_goods';
import fetch_diagnose_camp_goods_processing from './reducers/xly/fetch_diagnose_camp_goods_processing';
import pet_info from './reducers/pet_info/pet_info';
import teacher_create_msg_info from './reducers/teacher_msg/teacher_create_msg_info';
import oral_calculation_limittime from './reducers/do_paper/oral_calculation_limittime';
import final_access_limittime from './reducers/do_paper/final_access_limittime';
import profile_show_flag from './reducers/profile/profile_show_flag';

const rootReducer = {
    // game_list,
    app_info,
    feedback,
    wl_clazz_list_with_works,
    wl_is_worklist_loading,
    wl_is_fetch_status_loading,
    wl_is_fetch_paper_loading,
    wl_is_fetch_doPaper_loading,
    wl_is_paper_submitting,
    wl_is_post_answer_loading,
    wl_is_student_praise_loading,
    wl_is_local_ans_changed,
    wl_pagination_info,
    wl_selected_clazz,
    wl_selected_work,
    wl_class_with_pagination_info,
    profile_achievement,
    profile_clazz,
    profile_user_auth,
    clazz_with_study_stati,
    fetch_study_stati_processing,
    study_statis_params,
    unit,
    wl_paper_answer,
    trophy_selected_clazz,
    fetch_trophy_rank_data_processing,
    clazz_year_with_trophy_rank,
    trophy_selected_time,
    clazz_with_game_star_rank_data,
    fetch_game_star_rank_data_processing,
    clazz_with_fighter_rank_data,
    fetch_fighter_rank_data_processing,
    selected_good,
  /*  wxpay_created_order_info,
    wxpay_create_order_info_processing,
    wxpay_query_order_processing,
    wxpay_detail_fetch_processing,
    wxpay_detail_list,*/
    // group_buying_goods_list,
    // group_buying_goods_list_fetch_processing,
    // group_buying_selected_good,
    // group_buying_created_order_info,
    // group_buying_create_order_info_processing,
    // query_group_buying_order_processing,
   /* olympic_math_selected_clazz,
    olympic_math_selected_grade,
    work_list_route,*/
    fetch_wei_xin_pay_02_goods_processing,
    fetch_wei_xin_pay_02_create_order_processing,
    fetch_wei_xin_pay_02_order_processing,
    wei_xin_pay_02_select_good,
    wei_xin_pay_02_created_order_info,
    mo_goods_menus_list,
    wei_xin_pay_02_select_grade,
    sharding_clazz,
    user_reward_base,
    get_user_reward_base_processing,
    fetch_level_name_list_processing,
    level_name_list,
    update_user_reward_base_processing,

    work_report_info,
    ques_record,
    select_work_knowledge,
    diagnose_ad_dialog_flag,
    smart_training_camp_info,
    get_smart_training_camp_reward_processing,
    diagnose_camp_goods,
    fetch_diagnose_camp_goods_processing,
    pet_info,
    teacher_create_msg_info,
    oral_calculation_limittime,
    final_access_limittime,
    profile_show_flag,

};
export default rootReducer;