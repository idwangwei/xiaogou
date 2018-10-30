/**
 * Created by qiyuexi on 2018/1/13.
 */
import diagnose_selected_grade from './reducers/diagnose_selected_grade';
import diagnose_selected_textbook from './reducers/diagnose_selected_textbook';
import fetch_home_stati_processing from './reducers/fetch_home_stati_processing';
import diagnose_home_with_statistic from './reducers/diagnose_home_with_statistic';
import home_select_chapter from './reducers/home_select_chapter';
import chapter_select_point from './reducers/chapter_select_point';
import fetch_chapter_diagnose_processing from './reducers/fetch_chapter_diagnose_processing';
import knowledge_with_question from './reducers/knowledge_with_question';
import knowledge_with_report from './reducers/knowledge_with_report';
import fetch_diagnose_report_processing from './reducers/fetch_diagnose_report_processing';
import unit_with_diagnose_stati from './reducers/unit_with_diagnose_stati';
import diagnose_selected_clazz from './reducers/diagnose_selected_clazz';
import fetch_unit_stati_processing from './reducers/fetch_unit_stati_processing';
import fetch_unit_knowledge_stati_processing from './reducers/fetch_unit_knowledge_stati_processing';
import unit_select_knowledge from './reducers/unit_select_knowledge';
import fetch_q_records_processing from './reducers/fetch_q_records_processing';
import q_records_pagination_info from './reducers/q_records_pagination_info';
import fetch_diagnose_question_processing from './reducers/fetch_diagnose_question_processing';
import go_to_do_question from './reducers/go_to_do_question';
import diagnose_submit_q_processing from './reducers/diagnose_submit_q_processing';
import knowledge_with_diagnose_stati from './reducers/knowledge_with_diagnose_stati';
import q_with_error_records from './reducers/q_with_error_records';
import knowledge_selected_q from './reducers/knowledge_selected_q';
import diagnose_clazz_with_unit from './reducers/diagnose_clazz_with_unit';
import fetch_goods_menus_processing from './reducers/fetch_goods_menus_processing';
import diagnose_goods_menus_list from './reducers/diagnose_goods_menus_list';
import fetch_diagnose_textbook_processing from './reducers/fetch_diagnose_textbook_processing';
import fetch_chapter_stati_processing from './reducers/fetch_chapter_stati_processing';
import unit_select_chapter from './reducers/unit_select_chapter';
import chapter_with_diagnose_stati from './reducers/chapter_with_diagnose_stati';
import increase_score_goods_menus_list from './reducers/increase_score_goods_menus_list';
import first_submit_work_after_update from './reducers/first_submit_work_after_update';
import diagnose_entry_url_from from './reducers/diagnose_entry_url_from';
let rootReducer = {
    diagnose_selected_grade,
    diagnose_selected_textbook,
    fetch_home_stati_processing,
    diagnose_home_with_statistic,
    home_select_chapter,
    chapter_select_point,
    fetch_chapter_diagnose_processing,
    knowledge_with_question,
    knowledge_with_report,
    fetch_diagnose_report_processing,
    unit_with_diagnose_stati,
    diagnose_selected_clazz,
    fetch_unit_stati_processing,
    fetch_unit_knowledge_stati_processing,
    unit_select_knowledge,
    fetch_q_records_processing,
    q_records_pagination_info,
    fetch_diagnose_question_processing,
    go_to_do_question,
    diagnose_submit_q_processing,
    knowledge_with_diagnose_stati,
    q_with_error_records,
    knowledge_selected_q,
    diagnose_clazz_with_unit,
    fetch_goods_menus_processing,
    diagnose_goods_menus_list,
    fetch_diagnose_textbook_processing,
    fetch_chapter_stati_processing,
    unit_select_chapter,
    chapter_with_diagnose_stati,
    increase_score_goods_menus_list,
    first_submit_work_after_update,
    diagnose_entry_url_from,
};
export default rootReducer;