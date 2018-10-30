/**
 * Created by qiyuexi on 2017/12/7.
 */

import ae_fetch_textbook_processing from './reducers/ae_fetch_textbook_processing';
import ae_textbooks from './reducers/ae_textbook';
import ae_selected_textbook from './reducers/ae_selected_textbook';
import ae_selected_unit from './reducers/ae_selected_unit';
import ae_compose_multi_unit_paper from './reducers/ae_compose_multi_unit_paper';
import ae_compose_temp_paper from './reducers/ae_compose_temp_paper';
import ae_paper_list from './reducers/ae_paper_list';
import ae_score_type_list from './reducers/ae_score_type_list';
import ae_statics_info from './reducers/ae_statics_info';
import ae_paper_clazz_list from './reducers/ae_paper_clazz_list';
import ae_auto_paper_list from './reducers/ae_auto_paper_list';
import wr_ae_selected_paper from './reducers/wr_ae_selected_paper';
import ae_all_report_info from './reducers/ae_all_report_info';

let rootReducer = {
    ae_fetch_textbook_processing,
    ae_textbooks,
    ae_selected_textbook,
    ae_selected_unit,
    ae_compose_multi_unit_paper,
    ae_compose_temp_paper,
    ae_paper_list,
    ae_score_type_list,
    ae_statics_info,
    ae_paper_clazz_list,
    ae_auto_paper_list,
    wr_ae_selected_paper,
    ae_all_report_info,
};
export default rootReducer;