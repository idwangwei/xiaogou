/**
 * Created by ZL on 2018/1/29.
 */
import winter_camp_selected_grade from './reducers/winter_camp_selected_grade';
import winter_camp_selected_textbook from './reducers/winter_camp_selected_textbook';
import fetch_winter_camp_game_list_processing from './reducers/fetch_winter_camp_game_list_processing';
import select_winter_camp_game from './reducers/select_winter_camp_game';
import winter_camp_game_list from './reducers/winter_camp_game_list';
import fetch_winter_camp_all_course_processing from './reducers/fetch_winter_camp_all_course_processing';
import select_winter_camp_course from './reducers/select_winter_camp_course';
import winter_camp_all_courses from './reducers/winter_camp_all_courses';
import current_course_info from './reducers/current_course_info';
import winter_camp_vip from './reducers/winter_camp_vip';
import show_winter_camp_ad from './reducers/show_winter_camp_ad';
import winter_camp_share_record from './reducers/winter_camp_share_record';
import study_course_count from './reducers/study_course_count';

let rootReducer = {
    winter_camp_selected_grade,
    winter_camp_selected_textbook,
    winter_camp_game_list,
    fetch_winter_camp_game_list_processing,
    select_winter_camp_game,
    fetch_winter_camp_all_course_processing,
    select_winter_camp_course,
    winter_camp_all_courses,
    current_course_info,
    winter_camp_vip,
    show_winter_camp_ad,
    winter_camp_share_record,
    study_course_count
};
export default rootReducer;